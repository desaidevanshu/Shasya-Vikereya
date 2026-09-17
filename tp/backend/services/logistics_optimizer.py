"""
Delivered Economics & Profit-Maximizing Logistics Optimizer.
Calculates route distance, fuel consumption, driver allowances, tolls,
and vehicle capacity to optimize net farmer realization.
"""
from typing import Dict, Any, List

VEHICLE_FLEET = {
    "tata_ace": {
        "name": "Tata Ace Gold (1.0 Tonne)",
        "capacity_kg": 1000,
        "mileage_km_per_l": 14.0,
        "base_dispatch_fee": 1100.0,
        "driver_day_rate": 650.0,
        "toll_estimate": 320.0,
        "is_refrigerated": False,
        "reefer_overhead_per_km": 0.0
    },
    "bolero_maxi": {
        "name": "Mahindra Bolero Maxi Truck (1.5 Tonne)",
        "capacity_kg": 1500,
        "mileage_km_per_l": 11.0,
        "base_dispatch_fee": 1500.0,
        "driver_day_rate": 800.0,
        "toll_estimate": 380.0,
        "is_refrigerated": False,
        "reefer_overhead_per_km": 0.0
    },
    "eicher_reefer": {
        "name": "Eicher Pro Cold-Chain Reefer (3.5 Tonne)",
        "capacity_kg": 3500,
        "mileage_km_per_l": 7.5,
        "base_dispatch_fee": 2600.0,
        "driver_day_rate": 1100.0,
        "toll_estimate": 620.0,
        "is_refrigerated": True,
        "reefer_overhead_per_km": 3.50
    }
}

class LogisticsOptimizer:
    def __init__(self):
        self.diesel_price_per_l = 94.20

    def optimize_route(
        self,
        total_quantity_kg: float,
        origin_nodes: List[Dict[str, Any]],
        destination_node: Dict[str, Any],
        diesel_price: float = None,
        traffic_delay_pct: float = 0.0,
        ambient_temp_c: float = 31.0,
        force_reefer: bool = False
    ) -> Dict[str, Any]:
        """
        Plans optimal milk-run route from multi-farm pickup to destination hub.
        Evaluates vehicle economics, fuel consumption, and net delivered cost.
        """
        current_diesel = diesel_price or self.diesel_price_per_l

        # Select ideal vehicle by capacity and perishability
        if force_reefer or (ambient_temp_c > 33.0 and total_quantity_kg > 800):
            vehicle_id = "eicher_reefer"
        elif total_quantity_kg <= 1000:
            vehicle_id = "tata_ace"
        elif total_quantity_kg <= 1500:
            vehicle_id = "bolero_maxi"
        else:
            vehicle_id = "eicher_reefer"

        vehicle = VEHICLE_FLEET[vehicle_id]

        # Waypoints for Nashik -> Mumbai Corridor
        # 1. Pickup 1: Niphad / Dindori
        # 2. Consolidation Hub: Pimpalgaon Agro-Park
        # 3. Transit via NH60 / Samruddhi Expressway connector
        # 4. Drop: Vashi / Dadar Terminal Hub
        base_distance_km = 178.0
        # Multi-stop pickup overhead
        num_pickups = max(1, len(origin_nodes))
        pickup_circuit_km = (num_pickups - 1) * 14.5
        total_route_distance_km = round(base_distance_km + pickup_circuit_km, 1)

        # Baseline transit duration: 178 km @ ~45 km/h average speed in ghat section = ~4.0 hours
        base_duration_hours = (total_route_distance_km / 44.0)
        # Apply traffic delay shock if any
        actual_duration_hours = round(base_duration_hours * (1.0 + (traffic_delay_pct / 100.0)), 2)

        # Fuel and financial calculation
        fuel_litres = round(total_route_distance_km / vehicle["mileage_km_per_l"], 2)
        fuel_cost = round(fuel_litres * current_diesel, 2)
        reefer_cost = round(total_route_distance_km * vehicle["reefer_overhead_per_km"], 2)
        total_logistics_cost = round(
            vehicle["base_dispatch_fee"] + 
            fuel_cost + 
            vehicle["driver_day_rate"] + 
            vehicle["toll_estimate"] + 
            reefer_cost, 
            2
        )

        cost_per_kg = round(total_logistics_cost / max(1.0, total_quantity_kg), 2)
        utilization_pct = round((total_quantity_kg / vehicle["capacity_kg"]) * 100.0, 1)

        # Comparison with Naive Individual Dispatches (each farmer booking solo tempos)
        naive_total_km = num_pickups * 165.0
        naive_total_cost = num_pickups * 3400.0
        saved_km = round(naive_total_km - total_route_distance_km, 1)
        saved_cost = round(naive_total_cost - total_logistics_cost, 2)
        saved_cost_pct = round((saved_cost / naive_total_cost) * 100.0, 1)

        waypoints = [
            {"name": "Niphad Farm Cluster 1", "role": "Pickup A (350 kg)", "lat": 20.08, "lon": 74.11, "eta_minutes": 0},
            {"name": "Dindori Farm Cluster 2", "role": "Pickup B (450 kg)", "lat": 20.20, "lon": 73.83, "eta_minutes": 35},
            {"name": "Pimpalgaon Agro Hub", "role": "FPO Consolidation (600 kg)", "lat": 20.17, "lon": 73.98, "eta_minutes": 70},
            {"name": "Igatpuri / Kasara Ghat Waypoint", "role": "Transit Checkpoint", "lat": 19.69, "lon": 73.56, "eta_minutes": 150},
            {"name": "Thane Toll Plaza", "role": "Urban Entry Gate", "lat": 19.21, "lon": 73.00, "eta_minutes": int(actual_duration_hours * 50)},
            {"name": destination_node.get("name", "Vashi Terminal Hub, Navi Mumbai"), "role": "Final Bulk Delivery", "lat": 19.07, "lon": 72.99, "eta_minutes": int(actual_duration_hours * 60)}
        ]

        return {
            "vehicle_used": vehicle["name"],
            "vehicle_type": vehicle_id,
            "is_refrigerated": vehicle["is_refrigerated"],
            "capacity_kg": vehicle["capacity_kg"],
            "loaded_quantity_kg": total_quantity_kg,
            "capacity_utilization_pct": min(100.0, utilization_pct),
            "route_distance_km": total_route_distance_km,
            "transit_duration_hours": actual_duration_hours,
            "fuel_consumed_litres": fuel_litres,
            "diesel_price_per_l": current_diesel,
            "fuel_cost_rs": fuel_cost,
            "toll_cost_rs": vehicle["toll_estimate"],
            "driver_cost_rs": vehicle["driver_day_rate"],
            "reefer_overhead_rs": reefer_cost,
            "total_logistics_cost_rs": total_logistics_cost,
            "logistics_cost_per_kg": cost_per_kg,
            "waypoints": waypoints,
            "consolidation_benefit": {
                "naive_solo_km": naive_total_km,
                "optimized_km": total_route_distance_km,
                "empty_km_avoided": saved_km,
                "naive_solo_cost_rs": naive_total_cost,
                "cost_saved_rs": saved_cost,
                "cost_reduction_pct": saved_cost_pct
            }
        }

    def compare_routes(
        self,
        commodity: str = "Tomato",
        quantity_kg: float = 1350.0,
        ambient_temp_c: float = 31.0,
        diesel_price: float = 94.20,
        vehicle_type: str = "bolero_maxi",
        traffic_delay_pct: float = 0.0,
        is_refrigerated: bool = False,
        buyer_agreed_price_per_kg: float = 26.50
    ) -> Dict[str, Any]:
        """
        Calculates delivered economics and farmer profit across 3 realistic corridors:
        - Route A: NH-160 via Kasara Ghat (Traditional Corridor)
        - Route B: Samruddhi Mahamarg Expressway (Faster, Flatter, Higher Profit Winner)
        - Route C: SH-44 Rural Toll-Free (Slower, Thermal & Vibration Loss)
        """
        vehicle = VEHICLE_FLEET.get(vehicle_type, VEHICLE_FLEET["bolero_maxi"])
        mileage = vehicle["mileage_km_per_l"]
        driver_rate = vehicle["driver_day_rate"]
        base_fee = vehicle["base_dispatch_fee"]

        # Route definitions
        routes_meta = [
            {
                "id": "route_b",
                "name": "Route B: Samruddhi Mahamarg Expressway",
                "tag": "WINNER: PROFIT MAXIMIZER",
                "color": "#0ea5e9", # Cyan highlight
                "distance_km": 212.0,
                "base_duration_hours": 3.2,
                "toll_rs": 580.0,
                "vibration_bruising_pct": 0.8, # Ultra smooth asphalt
                "elevation_delta_m": 320,
                "summary": "34 km longer, but 55 min faster with flat grade-separated viaducts. Avoids bruising and thermal exposure.",
                "waypoints": [
                    {"name": "Pimpalgaon Agro Hub", "lat": 20.1746, "lon": 73.9825, "elevation_m": 580, "eta_h": 0.0, "role": "Consolidation Origin"},
                    {"name": "Dindori Farm Hub", "lat": 20.2012, "lon": 73.8341, "elevation_m": 595, "eta_h": 0.5, "role": "Pickup Node"},
                    {"name": "Nashik Samruddhi Entry", "lat": 19.9450, "lon": 73.8820, "elevation_m": 570, "eta_h": 0.9, "role": "Expressway Interchange"},
                    {"name": "Sinnar South Viaduct", "lat": 19.8456, "lon": 74.0012, "elevation_m": 610, "eta_h": 1.3, "role": "High-Speed Sector"},
                    {"name": "Igatpuri Bypass Tunnels", "lat": 19.7210, "lon": 73.6120, "elevation_m": 590, "eta_h": 1.8, "role": "Ghat Tunnel Bypass"},
                    {"name": "Kasara Viaduct Overpass", "lat": 19.6450, "lon": 73.5210, "elevation_m": 380, "eta_h": 2.2, "role": "Continuous Grade Descent"},
                    {"name": "Padgha Freight Node", "lat": 19.3450, "lon": 73.1890, "elevation_m": 85, "eta_h": 2.6, "role": "Suburban Logistics Hub"},
                    {"name": "Thane Outer Express", "lat": 19.2066, "lon": 72.9756, "elevation_m": 18, "eta_h": 2.9, "role": "Electronic Toll Cordon"},
                    {"name": "Vashi Direct Bulk Dock", "lat": 19.0728, "lon": 72.9988, "elevation_m": 12, "eta_h": 3.2, "role": "Direct Wholesale Delivery"}
                ],
                "path": [
                    [20.1746, 73.9825], [20.2012, 73.8341], [19.9450, 73.8820],
                    [19.8456, 74.0012], [19.7210, 73.6120], [19.6450, 73.5210],
                    [19.3450, 73.1890], [19.2066, 72.9756], [19.0728, 72.9988]
                ]
            },
            {
                "id": "route_a",
                "name": "Route A: NH-160 via Kasara Ghat",
                "tag": "CONVENTIONAL ROUTE",
                "color": "#f59e0b", # Amber
                "distance_km": 178.0,
                "base_duration_hours": 4.1,
                "toll_rs": 320.0,
                "vibration_bruising_pct": 3.8, # Hairpins & heavy braking
                "elevation_delta_m": 580,
                "summary": "Shortest geographic distance (178 km), but sharp hairpin curves, engine braking, and traffic bottlenecks at Kasara Ghat.",
                "waypoints": [
                    {"name": "Pimpalgaon Agro Hub", "lat": 20.1746, "lon": 73.9825, "elevation_m": 580, "eta_h": 0.0, "role": "Consolidation Origin"},
                    {"name": "Dindori Farm Hub", "lat": 20.2012, "lon": 73.8341, "elevation_m": 595, "eta_h": 0.5, "role": "Pickup Node"},
                    {"name": "Nashik City Arterial", "lat": 19.9975, "lon": 73.7898, "elevation_m": 580, "eta_h": 1.0, "role": "Urban Conurbation"},
                    {"name": "Igatpuri Checkpoint", "lat": 19.6978, "lon": 73.5623, "elevation_m": 605, "eta_h": 1.9, "role": "Ghat Approach"},
                    {"name": "Kasara Ghat Hairpins", "lat": 19.6631, "lon": 73.4982, "elevation_m": 290, "eta_h": 2.6, "role": "Severe Descent & Thermal Load"},
                    {"name": "Shahapur Bottleneck", "lat": 19.4542, "lon": 73.3321, "elevation_m": 45, "eta_h": 3.2, "role": "Truck Halting Station"},
                    {"name": "Thane Majiwada Cordon", "lat": 19.2066, "lon": 72.9756, "elevation_m": 18, "eta_h": 3.8, "role": "Urban Toll Plaza"},
                    {"name": "Vashi Direct Bulk Dock", "lat": 19.0728, "lon": 72.9988, "elevation_m": 12, "eta_h": 4.1, "role": "Direct Wholesale Delivery"}
                ],
                "path": [
                    [20.1746, 73.9825], [20.2012, 73.8341], [19.9975, 73.7898],
                    [19.6978, 73.5623], [19.6631, 73.4982], [19.4542, 73.3321],
                    [19.2066, 72.9756], [19.0728, 72.9988]
                ]
            },
            {
                "id": "route_c",
                "name": "Route C: SH-44 via Junnar / Malshej (Toll-Free)",
                "tag": "TOLL-FREE TRAP (HIGH DEPRECIATION)",
                "color": "#f43f5e", # Rose / Red
                "distance_km": 195.0,
                "base_duration_hours": 6.4,
                "toll_rs": 0.0,
                "vibration_bruising_pct": 9.4, # Potholes & single lane
                "elevation_delta_m": 710,
                "summary": "Zero toll cost, but rough single-lane roads and 6.4 hours of heat exposure cause massive produce degradation and fuel waste.",
                "waypoints": [
                    {"name": "Pimpalgaon Agro Hub", "lat": 20.1746, "lon": 73.9825, "elevation_m": 580, "eta_h": 0.0, "role": "Consolidation Origin"},
                    {"name": "Sinnar Rural South", "lat": 19.8210, "lon": 73.9810, "elevation_m": 620, "eta_h": 0.8, "role": "Rural Highway"},
                    {"name": "Sangamner West", "lat": 19.5710, "lon": 74.2110, "elevation_m": 550, "eta_h": 1.9, "role": "Town Slowdown"},
                    {"name": "Junnar Agricultural Belt", "lat": 19.2080, "lon": 73.8760, "elevation_m": 690, "eta_h": 3.4, "role": "Midway Rural Node"},
                    {"name": "Malshej Ghat Pass", "lat": 19.3420, "lon": 73.7820, "elevation_m": 710, "eta_h": 4.5, "role": "Steep Single-Lane Pass"},
                    {"name": "Murbad Single Lane", "lat": 19.2510, "lon": 73.3980, "elevation_m": 70, "eta_h": 5.4, "role": "Rough Surface & Vibration"},
                    {"name": "Kalyan East Intersection", "lat": 19.2310, "lon": 73.1420, "elevation_m": 25, "eta_h": 6.0, "role": "Dense Traffic Delay"},
                    {"name": "Vashi Direct Bulk Dock", "lat": 19.0728, "lon": 72.9988, "elevation_m": 12, "eta_h": 6.4, "role": "Direct Wholesale Delivery"}
                ],
                "path": [
                    [20.1746, 73.9825], [19.8210, 73.9810], [19.5710, 74.2110],
                    [19.2080, 73.8760], [19.3420, 73.7820], [19.2510, 73.3980],
                    [19.2310, 73.1420], [19.0728, 72.9988]
                ]
            }
        ]

        evaluated_routes = []
        best_profit = -999999.0
        winner_id = "route_b"

        for r in routes_meta:
            dist = r["distance_km"]
            # Apply traffic factor
            dur = round(r["base_duration_hours"] * (1.0 + (traffic_delay_pct / 100.0)), 2)
            
            # Fuel
            fuel_litres = round(dist / mileage, 2)
            fuel_cost = round(fuel_litres * diesel_price, 2)
            
            # Reefer overhead
            reefer_overhead = round(dist * 3.50, 2) if is_refrigerated else 0.0
            
            # Total delivered logistics
            total_logistics = round(base_fee + fuel_cost + driver_rate + r["toll_rs"] + reefer_overhead, 2)
            logistics_per_kg = round(total_logistics / max(1.0, quantity_kg), 2)
            
            # Freshness and Thermal Decay calculation
            effective_temp = 12.0 if is_refrigerated else ambient_temp_c
            temp_decay_factor = max(1.0, 1.0 + ((effective_temp - 22.0) * 0.08))
            freshness_remaining = max(15.0, round(100.0 - (dur * 3.2 * temp_decay_factor) - (r["vibration_bruising_pct"] * 1.5), 1))
            
            # Physical quality loss (bruising / skin burst deduction)
            bruised_kg = round(quantity_kg * (r["vibration_bruising_pct"] / 100.0), 1)
            bruise_loss_rs = round(bruised_kg * buyer_agreed_price_per_kg * 0.45, 2)
            
            # Thermal heat softening penalty (perishable vegetables degrade faster at high temps and long exposure)
            heat_exposure_hours = max(0.0, dur - 2.5)
            thermal_softening_pct = round(heat_exposure_hours * 0.022 * max(1.0, (effective_temp - 24.0) * 0.15) * 100.0, 1)
            thermal_loss_rs = round((thermal_softening_pct / 100.0) * (quantity_kg * buyer_agreed_price_per_kg), 2)
            
            total_quality_loss_rs = round(bruise_loss_rs + thermal_loss_rs, 2)

            # Gross Buyer Payment
            gross_buyer_payment = round(quantity_kg * buyer_agreed_price_per_kg, 2)
            
            # Farmer Net Payout = Gross Buyer Payment - Delivered Logistics - Quality Loss
            farmer_net_payout = round(gross_buyer_payment - total_logistics - total_quality_loss_rs, 2)
            farmer_net_per_kg = round(farmer_net_payout / max(1.0, quantity_kg), 2)

            is_winner = False
            if farmer_net_payout > best_profit:
                best_profit = farmer_net_payout
                winner_id = r["id"]

            evaluated_routes.append({
                "id": r["id"],
                "name": r["name"],
                "tag": r["tag"],
                "color": r["color"],
                "distance_km": dist,
                "duration_hours": dur,
                "fuel_litres": fuel_litres,
                "fuel_cost_rs": fuel_cost,
                "toll_cost_rs": r["toll_rs"],
                "total_logistics_cost_rs": total_logistics,
                "logistics_cost_per_kg": logistics_per_kg,
                "vibration_bruising_pct": r["vibration_bruising_pct"],
                "bruised_kg": bruised_kg,
                "bruise_loss_rs": bruise_loss_rs,
                "thermal_loss_rs": thermal_loss_rs,
                "quality_loss_rs": total_quality_loss_rs,
                "freshness_pct": freshness_remaining,
                "farmer_net_payout_rs": farmer_net_payout,
                "farmer_net_per_kg": farmer_net_per_kg,
                "summary": r["summary"],
                "waypoints": r["waypoints"],
                "path": r["path"]
            })

        # Mark winner and calculate differential justification
        for route in evaluated_routes:
            if route["id"] == winner_id:
                route["is_winner"] = True
            else:
                route["is_winner"] = False

        # Find route B and route A to build economic justification
        route_b = next(x for x in evaluated_routes if x["id"] == "route_b")
        route_a = next(x for x in evaluated_routes if x["id"] == "route_a")
        diff_net = round(route_b["farmer_net_payout_rs"] - route_a["farmer_net_payout_rs"], 2)
        diff_per_kg = round(route_b["farmer_net_per_kg"] - route_a["farmer_net_per_kg"], 2)

        justification = (
            f"Why the Expressway (Route B) Wins: Even though Route B is 34 km longer and costs "
            f"₹{round(route_b['total_logistics_cost_rs'] - route_a['total_logistics_cost_rs'], 2)} more in diesel & tolls, "
            f"saving 0.9 hours of heat exposure and avoiding sharp Kasara Ghat hairpins saves "
            f"{round(route_a['bruised_kg'] - route_b['bruised_kg'], 1)} kg of produce from vibration bruising. "
            f"This delivers an extra +₹{diff_net} (+₹{diff_per_kg}/kg) directly into the farmers' bank accounts."
        )

        return {
            "commodity": commodity,
            "quantity_kg": quantity_kg,
            "ambient_temp_c": ambient_temp_c,
            "diesel_price_per_l": diesel_price,
            "vehicle_used": vehicle["name"],
            "is_refrigerated": is_refrigerated,
            "buyer_agreed_price_per_kg": buyer_agreed_price_per_kg,
            "winning_route_id": winner_id,
            "profit_maximization_justification": justification,
            "routes": evaluated_routes
        }

logistics_optimizer = LogisticsOptimizer()

