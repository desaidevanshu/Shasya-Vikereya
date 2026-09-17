"""
KrishiClear: Main FastAPI Backend Application.
Algorithmic Clearinghouse & Digital Agri-Marketplace for SIH 26033.
"""
from pathlib import Path
from dotenv import load_dotenv

BACKEND_DIR = Path(__file__).resolve().parent
load_dotenv(BACKEND_DIR / ".env")

from fastapi import FastAPI, Query, Body, HTTPException, File, UploadFile, Response
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, Dict, Any, List
import requests
import uvicorn

from services.agmarknet_service import agmarknet_service
from services.clearing_engine import clearing_engine
from services.perishability_engine import perishability_engine
from services.logistics_optimizer import logistics_optimizer
from services.simulation_engine import simulation_engine
from services.compliance_service import compliance_service
from services.ledger_service import ledger_service
from services.ml_forecast_engine import ml_forecast_engine
from services.order_service import order_service

app = FastAPI(
    title="KrishiClear Engine API",
    description="Algorithmic Clearinghouse, Perishability Intelligence, and Delivered Economics for SIH 26033",
    version="2.0.0"
)

# Enable CORS for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "system": "KrishiClear Algorithmic Clearinghouse",
        "version": "2.0.0",
        "jurisdiction": "Maharashtra Direct Marketing Corridor (Nashik - Pune - Mumbai)"
    }

@app.post("/api/orders")
def create_marketplace_order(payload: Dict[str, Any] = Body(...)):
    try:
        return order_service.create_order(payload, actor_uid=payload.get("buyer_uid"))
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))

@app.get("/api/orders")
def list_marketplace_orders(role: Optional[str] = Query(None), uid: Optional[str] = Query(None)):
    return {"orders": order_service.list_orders(role=role, uid=uid)}

@app.post("/api/orders/{order_id}/payment")
def initiate_marketplace_payment(order_id: str):
    try:
        return order_service.initiate_payment(order_id)
    except KeyError as error:
        raise HTTPException(status_code=404, detail=str(error))
    except requests.RequestException as error:
        raise HTTPException(status_code=502, detail=f"Payment gateway error: {error}")

@app.patch("/api/orders/{order_id}")
def update_marketplace_order(order_id: str, payload: Dict[str, Any] = Body(...)):
    try:
        return order_service.update_order(order_id, payload)
    except KeyError as error:
        raise HTTPException(status_code=404, detail=str(error))
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))

@app.post("/api/orders/{order_id}/payment/verify")
def verify_marketplace_payment(order_id: str, payload: Dict[str, Any] = Body(...)):
    try:
        return order_service.verify_payment(order_id, payload["razorpay_order_id"], payload["razorpay_payment_id"], payload["razorpay_signature"])
    except (KeyError, ValueError) as error:
        raise HTTPException(status_code=400, detail=str(error))

# ----------------- Mandi Intelligence Endpoints -----------------
@app.get("/api/mandi/overview")
def get_mandi_overview():
    return agmarknet_service.get_market_overview()

@app.get("/api/mandi/corridor")
def get_price_corridor(commodity: str = Query("Tomato", description="Commodity name")):
    return agmarknet_service.get_price_corridor(commodity)

@app.get("/api/mandi/search")
def search_mandis(
    query: Optional[str] = Query(None, description="Mandi, district or commodity query"),
    state: Optional[str] = Query("Maharashtra", description="State filter"),
    commodity: Optional[str] = Query(None, description="Commodity filter"),
    limit: int = Query(50, ge=1, le=200)
):
    return agmarknet_service.search_all_mandis(query=query, state=state, commodity=commodity, limit=limit)

@app.get("/api/mandi/commodities")
def get_available_commodities(state: Optional[str] = Query("Maharashtra")):
    records = agmarknet_service.fetch_live_records(state=state, limit=100)
    commodities = sorted(list(set(r.get("commodity", "").strip() for r in records if r.get("commodity"))))
    return {"state": state, "total": len(commodities), "commodities": commodities}

# ----------------- AI Forecasting Endpoints -----------------
@app.get("/api/forecast")
def get_crop_forecast(commodity: str = Query("Tomato"), region: str = Query("Nashik")):
    return ml_forecast_engine.forecast_commodity(commodity, region)

# ----------------- Clearing Engine Endpoints -----------------
@app.get("/api/clearing/state")
def get_clearing_state():
    return clearing_engine.get_state()

@app.post("/api/clearing/solve")
def solve_clearing(
    ambient_temp_c: float = Body(30.0),
    traffic_delay_pct: float = Body(0.0),
    diesel_price: Optional[float] = Body(None),
    excluded_supplier_id: Optional[str] = Body(None)
):
    return clearing_engine.solve_clearing(
        excluded_supplier_id=excluded_supplier_id,
        ambient_temp_c=ambient_temp_c,
        traffic_delay_pct=traffic_delay_pct,
        diesel_price=diesel_price
    )

@app.post("/api/clearing/reclear")
def auto_reclear_dropout(dropped_farmer_id: str = Body(..., embed=True)):
    return clearing_engine.auto_reclear_dropout(dropped_farmer_id)

# ----------------- Digital Twin Simulation Studio -----------------
@app.post("/api/simulation/run")
def run_simulation_scenario(
    scenario_name: str = Body("custom"),
    traffic_delay_pct: float = Body(0.0),
    temperature_spike_c: float = Body(0.0),
    fuel_price_delta_rs: float = Body(0.0),
    simulate_dropout_farmer_id: Optional[str] = Body(None)
):
    return simulation_engine.run_scenario(
        scenario_name=scenario_name,
        traffic_delay_pct=traffic_delay_pct,
        temperature_spike_c=temperature_spike_c,
        fuel_price_delta_rs=fuel_price_delta_rs,
        simulate_dropout_farmer_id=simulate_dropout_farmer_id
    )

# ----------------- GIS & Smart Routing Endpoints -----------------
@app.get("/api/logistics/compare-routes")
def compare_routes(
    commodity: str = Query("Tomato"),
    quantity_kg: float = Query(1350.0),
    ambient_temp_c: float = Query(31.0),
    diesel_price: float = Query(94.20),
    vehicle_type: str = Query("bolero_maxi"),
    traffic_delay_pct: float = Query(0.0),
    is_refrigerated: bool = Query(False),
    buyer_agreed_price_per_kg: float = Query(26.50)
):
    return logistics_optimizer.compare_routes(
        commodity=commodity,
        quantity_kg=quantity_kg,
        ambient_temp_c=ambient_temp_c,
        diesel_price=diesel_price,
        vehicle_type=vehicle_type,
        traffic_delay_pct=traffic_delay_pct,
        is_refrigerated=is_refrigerated,
        buyer_agreed_price_per_kg=buyer_agreed_price_per_kg
    )

# ----------------- Compliance & Legal Guardrail -----------------
@app.get("/api/compliance/verify")
def verify_compliance(
    commodity: str = "Tomato",
    gross_value_rs: float = 35775.0,
    origin_district: str = "Nashik",
    destination_district: str = "Mumbai"
):
    return compliance_service.verify_trade_compliance(
        origin_district=origin_district,
        destination_district=destination_district,
        commodity=commodity,
        gross_trade_value_rs=gross_value_rs
    )

@app.get("/api/compliance/gate-pass")
def get_gate_pass(
    batch_id: str = Query("BATCH-MH-20260912-001"),
    vehicle_reg: str = Query("MH-15-EG-4921"),
    driver_name: str = Query("Santosh K. Shinde"),
    driver_phone: str = Query("+91 98220 11492"),
    origin: str = Query("Pimpalgaon Agro Hub, Nashik"),
    destination: str = Query("Vashi Wholesale Direct Dock, Navi Mumbai"),
    commodity: str = Query("Tomato (Hybrid Red Grade A)"),
    net_weight_kg: float = Query(1350.0)
):
    return compliance_service.generate_gate_pass(
        batch_id=batch_id,
        vehicle_reg=vehicle_reg,
        driver_name=driver_name,
        driver_phone=driver_phone,
        origin=origin,
        destination=destination,
        commodity=commodity,
        net_weight_kg=net_weight_kg
    )

# ----------------- FPO Command Center Analytics -----------------
@app.get("/api/fpo/analytics")
def get_fpo_analytics():
    """
    Dedicated analytics for FPOs including total volume, farmer payouts,
    average realization, and the standout 'Money Recovered by Optimization' KPI.
    """
    return {
        "fpo_name": "Pimpalgaon Farmer Producer Co. Ltd.",
        "fpo_registration": "MH-COOP-FPO-2021-9921",
        "district": "Nashik, Maharashtra",
        "member_farmers_count": 142,
        "kpis": {
            "total_volume_cleared_tonnes": 48.6,
            "gross_turnover_rs": 1287900.0,
            "total_farmer_payout_rs": 1056078.0,
            "average_farmer_realization_per_kg": 21.72,
            "conventional_mandi_benchmark_per_kg": 14.80,
            "average_logistics_cost_per_kg": 2.85,
            "spoilage_waste_rate_pct": 1.4,
            "conventional_spoilage_benchmark_pct": 18.5,
            "money_recovered_by_optimization_rs": 336288.0,
            "money_recovered_explanation": "Direct additional farmer realization unlocked through truck pooling, route optimization, APMC cess exemption, and cold-chain spoilage reduction vs. village middleman sales."
        },
        "recent_batches": [
            {
                "batch_id": "BATCH-MH-20260912-001",
                "commodity": "Tomato (Hybrid Red)",
                "quantity_kg": 1350,
                "farmer_net_realization_rs": 29335.50,
                "status": "COMPLETED & SETTLED",
                "upi_escrow_ref": "UPI-SETTLE-88219-OK"
            },
            {
                "batch_id": "BATCH-MH-20260910-004",
                "commodity": "Onion (Nashik Red)",
                "quantity_kg": 3000,
                "farmer_net_realization_rs": 72600.00,
                "status": "COMPLETED & SETTLED",
                "upi_escrow_ref": "UPI-SETTLE-77142-OK"
            },
            {
                "batch_id": "BATCH-MH-20260908-002",
                "commodity": "Spinach (Palak)",
                "quantity_kg": 800,
                "farmer_net_realization_rs": 22400.00,
                "status": "COMPLETED & SETTLED",
                "upi_escrow_ref": "UPI-SETTLE-66311-OK"
            }
        ],
        "top_buyers": [
            {"name": "Green Valley Apartment RWA, Vashi", "share_pct": 34},
            {"name": "FreshPlate Cloud Kitchens, Mumbai", "share_pct": 28},
            {"name": "Kothrud Society Consumers, Pune", "share_pct": 22},
            {"name": "Dadar Wholesale Direct Sinks", "share_pct": 16}
        ]
    }

# ----------------- Dynamic Lot Creation -----------------
@app.post("/api/farmer/list-produce")
def list_produce(lot: Dict[str, Any] = Body(...)):
    new_lot = {
        "farmer_id": f"FARM-{len(clearing_engine.supply_pool) + 1:02d}",
        "farmer_name": lot.get("farmer_name", "Anonymous Farmer"),
        "location": lot.get("location", "Nashik, Maharashtra"),
        "lat": lot.get("lat", 20.08),
        "lon": lot.get("lon", 74.11),
        "commodity": lot.get("commodity", "Tomato"),
        "grade": lot.get("grade", "Grade A"),
        "available_kg": float(lot.get("available_kg", 500)),
        "farmer_floor_price_rs": float(lot.get("farmer_floor_price_rs", 16.0)),
        "hours_since_harvest": float(lot.get("hours_since_harvest", 4.0)),
        "phone": lot.get("phone", "+91 98000 00000"),
        "fpo_affiliation": lot.get("fpo_affiliation", "Pimpalgaon Agro Producers Co.")
    }
    clearing_engine.supply_pool.append(new_lot)

    # --- FIREBASE PERSISTENCE ---
    try:
        from services.firebase_service import get_db
        db = get_db()
        if db:
            db.collection("lots").document(new_lot["farmer_id"]).set(new_lot)
    except Exception as e:
        print(f"Failed to persist lot: {e}")

    return {"message": "Supply lot registered successfully", "lot": new_lot}

@app.post("/api/buyer/create-demand")
def create_demand(rfq: Dict[str, Any] = Body(...)):
    new_demand = {
        "buyer_id": f"BUY-{len(clearing_engine.demand_pool) + 1:02d}",
        "buyer_name": rfq.get("buyer_name", "Anonymous Buyer"),
        "destination": rfq.get("destination", "Vashi, Navi Mumbai"),
        "lat": rfq.get("lat", 19.07),
        "lon": rfq.get("lon", 72.99),
        "commodity": rfq.get("commodity", "Tomato"),
        "grade": rfq.get("grade", "Grade A"),
        "requested_kg": float(rfq.get("requested_kg", 500)),
        "buyer_ceiling_price_rs": float(rfq.get("buyer_ceiling_price_rs", 28.0)),
        "buyer_type": rfq.get("buyer_type", "Bulk Buyer / RWA")
    }
    clearing_engine.demand_pool.append(new_demand)

    # --- FIREBASE PERSISTENCE ---
    try:
        from services.firebase_service import get_db
        db = get_db()
        if db:
            db.collection("demands").document(new_demand["buyer_id"]).set(new_demand)
    except Exception as e:
        print(f"Failed to persist demand: {e}")

    return {"message": "Buyer demand registered successfully", "demand": new_demand}

# ----------------- Model Context Protocol (MCP) Endpoints -----------------
from mcp_server import handle_mcp_request, MCP_TOOLS

@app.get("/api/mcp/tools")
def get_mcp_tools():
    return {"protocol": "JSON-RPC 2.0", "tools": MCP_TOOLS}

@app.post("/api/mcp/rpc")
def mcp_json_rpc(request: Dict[str, Any] = Body(...)):
    return handle_mcp_request(request)

# ----------------- Kisan Voice AI Assistant NLP Endpoint -----------------
from services.kisan_assistant_service import kisan_assistant_service
from services.agronomy_service import agronomy_service

@app.post("/api/kisan/assistant")
def kisan_assistant_query(payload: Dict[str, Any] = Body(...)):
    query = payload.get("query", "")
    lang = payload.get("lang", "en")
    return kisan_assistant_service.answer_farmer_query(query=query, lang=lang)

@app.get("/api/kisan/test-key")
@app.post("/api/kisan/test-key")
def kisan_test_gemini_key():
    return agronomy_service.test_gemini_connection()

# ----------------- Neural Edge-TTS & Groq STT Voice Pipeline -----------------
from services.edge_tts_service import edge_tts_service
from services.groq_stt_service import groq_stt_service

@app.post("/api/kisan/tts")
async def kisan_generate_tts(payload: Dict[str, Any] = Body(...)):
    """Streams natural human-sounding neural MP3 audio in Marathi, Hindi, or English."""
    text = payload.get("text", "")
    lang = payload.get("lang", "hi")
    voice = payload.get("voice")
    audio_bytes = await edge_tts_service.generate_audio_bytes(text=text, lang=lang, voice=voice)
    if not audio_bytes:
        raise HTTPException(status_code=400, detail="Could not generate audio for provided text.")
    return Response(content=audio_bytes, media_type="audio/mpeg")

@app.post("/api/kisan/transcribe")
async def kisan_transcribe_audio(
    file: UploadFile = File(...),
    lang: Optional[str] = Query(None, description="Optional language code ('mr', 'hi', 'en')")
):
    """Transcribes raw audio using Groq Whisper Large-v3 Turbo."""
    audio_bytes = await file.read()
    filename = file.filename or "audio.webm"
    result = groq_stt_service.transcribe_audio(audio_bytes, filename=filename, lang=lang)
    return result

@app.get("/api/kisan/telemetry")
def kisan_pipeline_telemetry():
    """Reports live status of all active engines & fallbacks."""
    return {
        "stt": groq_stt_service.get_status(),
        "llm": agronomy_service.test_gemini_connection(),
        "tts": edge_tts_service.get_status(),
        "webrtc": livekit_service.get_status(),
        "system_status": "OPERATIONAL"
    }

# ----------------- LiveKit WebRTC Voice Service Endpoints -----------------
from services.livekit_service import livekit_service

@app.get("/api/livekit/token")
def get_livekit_token(
    room: str = Query("kisan-room", description="LiveKit room name"),
    identity: Optional[str] = Query(None, description="Farmer participant identity"),
    name: Optional[str] = Query(None, description="Display name")
):
    return livekit_service.create_token(room_name=room, identity=identity, name=name)

@app.get("/api/livekit/status")
def get_livekit_status():
    return livekit_service.get_status()

# ----------------- 1. Milk-Run Cargo Pooling Endpoints -----------------
from services.milk_run_optimizer import milk_run_optimizer

@app.get("/api/milkrun/manifest")
def get_milk_run_manifest():
    return milk_run_optimizer.optimize_milk_run()

@app.post("/api/milkrun/optimize")
def optimize_milk_run_route(payload: Dict[str, Any] = Body(...)):
    participants = payload.get("participants")
    vehicle = payload.get("vehicle_type", "bolero_maxi")
    destination = payload.get("destination", "Vashi Wholesale Direct Terminal, Navi Mumbai")
    return milk_run_optimizer.optimize_milk_run(participants=participants, vehicle_type=vehicle, destination=destination)

# ----------------- 2. Auction Clock Distress Arbitrage Endpoints -----------------
from services.auction_clock_arbitrage import auction_clock_arbitrage

@app.get("/api/arbitrage/clocks")
def get_auction_clocks():
    return {"terminals": auction_clock_arbitrage.get_market_clocks()}

@app.post("/api/arbitrage/evaluate-reroute")
def evaluate_arbitrage_reroute(payload: Dict[str, Any] = Body(...)):
    delay = float(payload.get("delay_minutes", 90.0))
    commodity = payload.get("commodity", "Tomato")
    qty = float(payload.get("quantity_kg", 1350.0))
    location = payload.get("current_location", "Igatpuri Checkpoint (Mid-Transit)")
    return auction_clock_arbitrage.evaluate_mid_transit_reroute(
        delay_minutes=delay,
        commodity=commodity,
        quantity_kg=qty,
        current_location=location
    )

# ----------------- 3. Cryptographic QA Manifest & Escrow Endpoints -----------------
from services.qa_manifest_service import qa_manifest_service

@app.post("/api/qa/generate-manifest")
def generate_qa_manifest(payload: Dict[str, Any] = Body(...)):
    batch_id = payload.get("batch_id", "BATCH-MH-20260912-001")
    commodity = payload.get("commodity", "Tomato (Hybrid Red Grade A)")
    crates = int(payload.get("total_crates", 54))
    weight = float(payload.get("total_weight_kg", 1350.0))
    escrow = float(payload.get("escrow_amount", 30378.58))
    return qa_manifest_service.generate_dispatch_manifest(
        batch_id=batch_id,
        commodity=commodity,
        total_crates=crates,
        total_weight_kg=weight,
        escrow_amount=escrow
    )

@app.post("/api/qa/resolve-escrow")
def resolve_qa_escrow(payload: Dict[str, Any] = Body(...)):
    manifest_id = payload.get("manifest_id", "QA-20260912-001")
    buyer_dispute = bool(payload.get("buyer_dispute", False))
    reason = payload.get("dispute_reason")
    return qa_manifest_service.resolve_escrow(
        manifest_id=manifest_id,
        buyer_dispute=buyer_dispute,
        dispute_reason=reason
    )

# ----------------- 4. Glut-Shock Industrial Processing Rescue Endpoints -----------------
from services.glut_rescue_service import glut_rescue_service

@app.get("/api/glut/status")
def get_glut_status(commodity: str = "Tomato"):
    return glut_rescue_service.evaluate_glut_condition(commodity=commodity)

@app.post("/api/glut/activate-rescue")
def activate_glut_rescue(payload: Dict[str, Any] = Body(...)):
    commodity = payload.get("commodity", "Tomato")
    simulated_price = float(payload.get("simulated_crash_price", 4.00))
    volume = float(payload.get("collective_volume_kg", 10000.0))
    return glut_rescue_service.activate_industrial_rescue(
        commodity=commodity,
        simulated_crash_price=simulated_price,
        collective_volume_kg=volume
    )

# ----------------- 5. WhatsApp & Audio Dispatch Simulator Endpoints -----------------
from services.whatsapp_dispatcher import whatsapp_dispatcher

@app.post("/api/whatsapp/dispatch-preview")
def preview_whatsapp_dispatch(payload: Dict[str, Any] = Body(...)):
    batch_id = payload.get("batch_id", "BATCH-MH-20260912-001")
    farmer_name = payload.get("farmer_name", "Tukaram G. Jadhav")
    farmer_phone = payload.get("farmer_phone", "+91 98224 81920")
    driver_name = payload.get("driver_name", "Santosh K. Shinde")
    driver_phone = payload.get("driver_phone", "+91 98231 44921")
    vehicle_reg = payload.get("vehicle_reg", "MH-15-EG-4921")
    commodity = payload.get("commodity", "Tomato (Hybrid Red Grade A)")
    quantity_kg = float(payload.get("quantity_kg", 1350.0))
    expected_net = float(payload.get("expected_net_payout", 30378.58))
    gate_pass_id = payload.get("gate_pass_id", "GP-MSAMB-2026-B340E4BE")
    lang = payload.get("lang", "mr")

    return whatsapp_dispatcher.generate_dispatch_card(
        batch_id=batch_id,
        farmer_name=farmer_name,
        farmer_phone=farmer_phone,
        driver_name=driver_name,
        driver_phone=driver_phone,
        vehicle_reg=vehicle_reg,
        commodity=commodity,
        quantity_kg=quantity_kg,
        expected_net_payout=expected_net,
        gate_pass_id=gate_pass_id,
        lang=lang
    )

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)


