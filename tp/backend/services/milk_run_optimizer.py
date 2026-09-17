"""
Milk-Run Smallholder Cargo Pooling Optimizer for KrishiClear.
Solves the aggregation barrier for marginal farmers (<500 kg) who cannot afford an individual truck.
Coordinates multi-stop rural cluster pickups, prorates transport costs fairly, and assigns QR crate slots.
"""

import math
from typing import Dict, Any, List

class MilkRunOptimizer:
    def __init__(self):
        # Default rural cluster along the Nashik horticultural belt
        self.default_cluster = [
            {
                "farmer_id": "FARMER-TK-01",
                "farmer_name": "Tukaram G. Jadhav",
                "village": "Dindori Agro Cluster",
                "lat": 20.2035,
                "lng": 73.8312,
                "commodity": "Tomato (Hybrid Grade A)",
                "crates": 15,
                "weight_kg": 375.0,
                "individual_truck_quote": 3800.0,
                "pickup_sequence": 1
            },
            {
                "farmer_id": "FARMER-SN-02",
                "farmer_name": "Sunita R. Shinde",
                "village": "Ozar Tomato Hub",
                "lat": 20.0965,
                "lng": 73.9184,
                "commodity": "Tomato (Hybrid Grade A)",
                "crates": 12,
                "weight_kg": 300.0,
                "individual_truck_quote": 3400.0,
                "pickup_sequence": 2
            },
            {
                "farmer_id": "FARMER-RM-03",
                "farmer_name": "Ramesh V. Patil",
                "village": "Pimpalgaon Baswant Outskirts",
                "lat": 20.1742,
                "lng": 73.9876,
                "commodity": "Tomato (Grade A Export)",
                "crates": 22,
                "weight_kg": 550.0,
                "individual_truck_quote": 3900.0,
                "pickup_sequence": 3
            },
            {
                "farmer_id": "FARMER-EK-04",
                "farmer_name": "Eknath B. Khairnar",
                "village": "Sinnar Agro Bypass",
                "lat": 19.8512,
                "lng": 73.9984,
                "commodity": "Tomato (Hybrid Red)",
                "crates": 16,
                "weight_kg": 400.0,
                "individual_truck_quote": 3200.0,
                "pickup_sequence": 4
            }
        ]

    def optimize_milk_run(
        self,
        participants: List[Dict[str, Any]] = None,
        vehicle_type: str = "bolero_maxi",
        destination: str = "Vashi Wholesale Direct Terminal, Navi Mumbai"
    ) -> Dict[str, Any]:
        """
        Aggregates smallholders, assigns crate slots, and computes prorated savings.
        """
        farmers = participants or self.default_cluster

        total_weight_kg = sum(f["weight_kg"] for f in farmers)
        total_crates = sum(f["crates"] for f in farmers)

        # Vehicle capacity constraints
        capacities = {
            "tata_ace": 850.0,
            "bolero_maxi": 1750.0,
            "eicher_reefer": 4500.0
        }
        vehicle_cap_kg = capacities.get(vehicle_type, 1750.0)
        utilization_pct = round((total_weight_kg / vehicle_cap_kg) * 100.0, 1)

        # Base logistics costs for the shared vehicle (Nashik cluster to Mumbai via Samruddhi)
        # 212 km total line-haul + 45 km rural milk-run pickup loop
        total_trip_km = 257.0
        diesel_liters = round(total_trip_km / 14.0, 1) # ~18.4 L
        diesel_cost = round(diesel_liters * 94.20, 2) # ₹1,733.28
        toll_cost = 580.0
        driver_allowance = 1100.0
        fpo_handling_fee = round(total_crates * 8.0, 2) # ₹8/crate loading

        total_shared_cost = round(diesel_cost + toll_cost + driver_allowance + fpo_handling_fee, 2) # ~₹3,933.28

        # Prorate costs fairly by weight fraction
        prorated_farmers = []
        cumulative_crates = 0
        total_individual_cost = 0.0

        for idx, f in enumerate(farmers, 1):
            weight_fraction = f["weight_kg"] / total_weight_kg
            prorated_cost = round(total_shared_cost * weight_fraction, 2)
            cost_per_kg = round(prorated_cost / f["weight_kg"], 2)
            cost_per_crate = round(prorated_cost / f["crates"], 2)

            indiv_quote = f["individual_truck_quote"]
            total_individual_cost += indiv_quote
            net_savings = round(indiv_quote - prorated_cost, 2)
            savings_pct = round((net_savings / indiv_quote) * 100.0, 1)

            slot_start = cumulative_crates + 1
            slot_end = cumulative_crates + f["crates"]
            cumulative_crates = slot_end

            prorated_farmers.append({
                "farmer_id": f["farmer_id"],
                "farmer_name": f["farmer_name"],
                "village": f["village"],
                "crates": f["crates"],
                "weight_kg": f["weight_kg"],
                "crate_slot_range": f"Slots #{slot_start} – #{slot_end}",
                "lot_qr_tag": f"QR-MILK-{f['farmer_id'][-5:]}-2026",
                "prorated_cost": prorated_cost,
                "cost_per_kg": cost_per_kg,
                "cost_per_crate": cost_per_crate,
                "individual_truck_quote": indiv_quote,
                "net_savings": net_savings,
                "savings_pct": savings_pct,
                "pickup_time_est": f"0{4 + idx}:15 AM"
            })

        collective_savings = round(total_individual_cost - total_shared_cost, 2)

        return {
            "status": "success",
            "cluster_name": "Nashik East Horticulture Belt (Loop #1)",
            "vehicle_assigned": {
                "type": vehicle_type,
                "plate": "MH-15-EG-4921",
                "driver": "Santosh K. Shinde",
                "driver_contact": "+91 98231 44921",
                "capacity_kg": vehicle_cap_kg,
                "current_load_kg": total_weight_kg,
                "utilization_pct": utilization_pct,
                "total_crates": total_crates
            },
            "trip_summary": {
                "total_km": total_trip_km,
                "milk_run_stops": len(farmers),
                "total_shared_logistics_cost": total_shared_cost,
                "total_unpooled_cost": total_individual_cost,
                "collective_farmer_savings": collective_savings,
                "avg_savings_per_farmer": round(collective_savings / len(farmers), 2),
                "average_cost_per_crate": round(total_shared_cost / total_crates, 2)
            },
            "farmers": prorated_farmers,
            "route_timeline": [
                {"stop": 1, "village": "Dindori Agro Hub", "time": "05:15 AM", "action": "Loaded 15 Crates (375 kg)"},
                {"stop": 2, "village": "Ozar Tomato Hub", "time": "06:00 AM", "action": "Loaded 12 Crates (300 kg)"},
                {"stop": 3, "village": "Pimpalgaon Outskirts", "time": "06:45 AM", "action": "Loaded 22 Crates (550 kg)"},
                {"stop": 4, "village": "Sinnar Bypass Entry", "time": "07:30 AM", "action": "Loaded 16 Crates (400 kg) - Vehicle Full"},
                {"stop": 5, "village": "Samruddhi Mahamarg Expressway", "time": "07:45 AM", "action": "Non-stop High-Speed Transit"},
                {"stop": 6, "village": "Vashi Direct Dock", "time": "11:05 AM", "action": "Automated Crate Discharge & Escrow Release"}
            ]
        }

milk_run_optimizer = MilkRunOptimizer()
