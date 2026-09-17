"""Order lifecycle, payment initiation, and Firestore persistence for the direct marketplace."""
import hashlib
import hmac
import os
import secrets
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, Optional

import requests

from .firebase_service import get_db


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


class OrderService:
    def _collection(self):
        db = get_db()
        return db.collection("marketplace_orders") if db else None

    def _persist(self, order: Dict[str, Any]) -> None:
        collection = self._collection()
        if collection:
            collection.document(order["order_id"]).set(order)

    def create_order(self, payload: Dict[str, Any], actor_uid: Optional[str] = None) -> Dict[str, Any]:
        quantity_kg = float(payload.get("quantity_kg", 0))
        price_per_kg = float(payload.get("price_per_kg", 0))
        if quantity_kg <= 0 or price_per_kg <= 0:
            raise ValueError("quantity_kg and price_per_kg must be positive")

        order = {
            "order_id": f"ORD-{uuid.uuid4().hex[:10].upper()}",
            "buyer_uid": actor_uid or payload.get("buyer_uid", "demo-buyer"),
            "buyer_name": payload.get("buyer_name", "Direct Buyer"),
            "farmer_uid": payload.get("farmer_uid", "pending-farmer"),
            "farmer_name": payload.get("farmer_name", "Open FPO Supply Pool"),
            "fpo_uid": payload.get("fpo_uid", "pending-fpo"),
            "fpo_name": payload.get("fpo_name", "Verified FPO Pool"),
            "commodity": payload.get("commodity", "Tomato"),
            "grade": payload.get("grade", "Grade A"),
            "quantity_kg": quantity_kg,
            "price_per_kg": price_per_kg,
            "produce_value_rs": round(quantity_kg * price_per_kg, 2),
            "delivery_address": payload.get("delivery_address", "Vashi Direct Bulk Dock, Navi Mumbai"),
            "delivery_deadline": payload.get("delivery_deadline", "Open"),
            "status": "PAYMENT_PENDING",
            "payment_status": "CREATED",
            "payment_provider": "razorpay" if os.getenv("RAZORPAY_KEY_ID") and os.getenv("RAZORPAY_KEY_SECRET") else "demo",
            "route_status": "AWAITING_PAYMENT",
            "created_at": utc_now(),
            "updated_at": utc_now(),
        }
        self._persist(order)
        return order

    def list_orders(self, role: Optional[str] = None, uid: Optional[str] = None) -> list[Dict[str, Any]]:
        collection = self._collection()
        if not collection:
            return []
        documents = collection.stream()
        orders = [doc.to_dict() for doc in documents]
        if not role or not uid:
            return orders
        role = role.lower()
        if role == "buyer":
            return [item for item in orders if item.get("buyer_uid") == uid]
        if role == "farmer":
            return [item for item in orders if item.get("farmer_uid") == uid or item.get("farmer_uid") == "pending-farmer"]
        if role == "fpo":
            return [item for item in orders if item.get("fpo_uid") == uid or item.get("fpo_uid") == "pending-fpo"]
        return orders

    def initiate_payment(self, order_id: str) -> Dict[str, Any]:
        order = self.get_order(order_id)
        if not order:
            raise KeyError("Order not found")

        key_id = os.getenv("RAZORPAY_KEY_ID")
        key_secret = os.getenv("RAZORPAY_KEY_SECRET")
        amount_paise = int(round(order["produce_value_rs"] * 100))
        if key_id and key_secret:
            response = requests.post(
                "https://api.razorpay.com/v1/orders",
                auth=(key_id, key_secret),
                json={"amount": amount_paise, "currency": "INR", "receipt": order_id, "notes": {"order_id": order_id}},
                timeout=15,
            )
            response.raise_for_status()
            gateway_order = response.json()
            order.update({"payment_status": "INITIATED", "gateway_order_id": gateway_order["id"], "updated_at": utc_now()})
            self._persist(order)
            return {"mode": "razorpay", "key_id": key_id, "order": order}

        payment_id = f"pay_demo_{secrets.token_hex(8)}"
        order.update({"payment_status": "PAID_DEMO", "status": "PAID", "route_status": "READY_FOR_DISPATCH", "gateway_payment_id": payment_id, "updated_at": utc_now()})
        self._persist(order)
        return {"mode": "demo", "order": order, "message": "Demo payment recorded. Configure Razorpay keys for live checkout."}

    def get_order(self, order_id: str) -> Optional[Dict[str, Any]]:
        collection = self._collection()
        if not collection:
            return None
        document = collection.document(order_id).get()
        return document.to_dict() if document.exists else None

    def update_order(self, order_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        order = self.get_order(order_id)
        if not order:
            raise KeyError("Order not found")
        allowed = {"commodity", "grade", "quantity_kg", "price_per_kg", "delivery_address", "delivery_deadline", "farmer_uid", "farmer_name", "fpo_uid", "fpo_name", "status", "route_status"}
        changes = {key: value for key, value in updates.items() if key in allowed}
        if "quantity_kg" in changes or "price_per_kg" in changes:
            quantity = float(changes.get("quantity_kg", order["quantity_kg"]))
            price = float(changes.get("price_per_kg", order["price_per_kg"]))
            if quantity <= 0 or price <= 0:
                raise ValueError("quantity_kg and price_per_kg must be positive")
            changes["quantity_kg"] = quantity
            changes["price_per_kg"] = price
            changes["produce_value_rs"] = round(quantity * price, 2)
        order.update(changes)
        order["updated_at"] = utc_now()
        self._persist(order)
        return order

    def verify_payment(self, order_id: str, razorpay_order_id: str, razorpay_payment_id: str, signature: str) -> Dict[str, Any]:
        secret = os.getenv("RAZORPAY_KEY_SECRET", "")
        expected = hmac.new(secret.encode(), f"{razorpay_order_id}|{razorpay_payment_id}".encode(), hashlib.sha256).hexdigest()
        if not secret or not hmac.compare_digest(expected, signature):
            raise ValueError("Invalid payment signature")
        order = self.get_order(order_id)
        if not order:
            raise KeyError("Order not found")
        order.update({"payment_status": "PAID", "status": "PAID", "route_status": "READY_FOR_DISPATCH", "gateway_payment_id": razorpay_payment_id, "updated_at": utc_now()})
        self._persist(order)
        return order


order_service = OrderService()
