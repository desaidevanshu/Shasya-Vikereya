"""
Glut-Shock Industrial Processing Rescue Network for KrishiClear.
Solves bumper harvest price collapses where farmers dump tomatoes on highways.
Aggregates FPOs into minimum 10-tonne industrial consignments for commercial food processors.
"""

from typing import Dict, Any, List
from .agmarknet_service import agmarknet_service

class GlutRescueService:
    def __init__(self):
        self.industrial_processors = [
            {
                "id": "PROC-SAHYADRI",
                "name": "Sahyadri Mega Food Park (Dindori Hub)",
                "location": "Mohadi, Dindori, Nashik",
                "intake_capacity_mt_day": 250.0,
                "institutional_floor_price_per_kg": 18.50,
                "specifications": "TSS >= 4.5° Brix, Paste Grade Red, Max 2% rot",
                "payment_cycle": "48-Hour Direct FPO Bank Transfer",
                "contract_type": "Institutional Long-Term Off-Take Agreement"
            },
            {
                "id": "PROC-NILONS",
                "name": "Nilons Agro Processing Terminal",
                "location": "Ambad MIDC, Nashik",
                "intake_capacity_mt_day": 120.0,
                "institutional_floor_price_per_kg": 17.80,
                "specifications": "Solid Content >= 4.8%, Firm Hybrid",
                "payment_cycle": "72-Hour RTGS",
                "contract_type": "Pre-season Contract Farming Agreement"
            }
        ]

    def evaluate_glut_condition(self, commodity: str = "Tomato") -> Dict[str, Any]:
        """Checks if current market price has crashed below production cost."""
        corridor = agmarknet_service.get_price_corridor(commodity)
        current_modal = corridor["modal_fair_price_per_kg"]
        farmer_floor = corridor["farmer_floor_per_kg"]

        # Glut is active if price is below farmer floor, or can be simulated
        is_glut = current_modal < farmer_floor

        return {
            "commodity": commodity,
            "current_market_modal_price": current_modal,
            "farmer_production_floor": farmer_floor,
            "glut_risk_active": is_glut,
            "status": "GLUT_CRASH_DETECTED" if is_glut else "NORMAL_MARKET_EQUILIBRIUM"
        }

    def activate_industrial_rescue(
        self,
        commodity: str = "Tomato",
        simulated_crash_price: float = 4.00,
        collective_volume_kg: float = 10000.0 # 10 Metric Tonnes
    ) -> Dict[str, Any]:
        """
        Activates the Emergency Industrial Processing Protocol:
        Aggregates 8 FPO lots to meet the 10-Tonne minimum factory dock quota.
        """
        processor = self.industrial_processors[0] # Sahyadri Mega Food Park
        proc_rate = processor["institutional_floor_price_per_kg"] # ₹18.50/kg

        # Economics of Highway Dump Loss:
        # If sold in crashed open market at ₹4.00/kg minus ₹3.20/kg transport: net return is ₹0.80/kg
        dump_revenue = round(collective_volume_kg * simulated_crash_price, 2)
        transport_to_mandi = round(collective_volume_kg * 3.20, 2)
        net_mandi_loss_scenario = round(dump_revenue - transport_to_mandi, 2) # Barely ₹8,000 for 10 tonnes!

        # Economics of Factory Gate Industrial Rescue:
        # Factory is local in Dindori (only 18 km transport = ₹0.75/kg)
        factory_gross_revenue = round(collective_volume_kg * proc_rate, 2) # ₹1,85,000
        local_haul_cost = round(collective_volume_kg * 0.75, 2) # ₹7,500
        net_factory_payout = round(factory_gross_revenue - local_haul_cost, 2) # ₹1,77,500

        salvaged_delta = round(net_factory_payout - net_mandi_loss_scenario, 2)

        # 8 FPO clusters consolidated
        fpo_batch_allocation = [
            {"fpo": "Dindori Shetkari Sangh", "allotted_kg": 1500.0, "payout": f"₹{1500 * proc_rate:,.2f}"},
            {"fpo": "Pimpalgaon Grape & Tomato FPO", "allotted_kg": 2000.0, "payout": f"₹{2000 * proc_rate:,.2f}"},
            {"fpo": "Niphad Agro Producer Co.", "allotted_kg": 1250.0, "payout": f"₹{1250 * proc_rate:,.2f}"},
            {"fpo": "Ozar Krishi Vikas Mandal", "allotted_kg": 1250.0, "payout": f"₹{1250 * proc_rate:,.2f}"},
            {"fpo": "Sinnar Progressive Farmers", "allotted_kg": 1000.0, "payout": f"₹{1000 * proc_rate:,.2f}"},
            {"fpo": "Kalwan Organic Producers", "allotted_kg": 1000.0, "payout": f"₹{1000 * proc_rate:,.2f}"},
            {"fpo": "Deola Horticulture Cluster", "allotted_kg": 1000.0, "payout": f"₹{1000 * proc_rate:,.2f}"},
            {"fpo": "Chandwad Krishi Samruddhi", "allotted_kg": 1000.0, "payout": f"₹{1000 * proc_rate:,.2f}"}
        ]

        return {
            "status": "INDUSTRIAL_RESCUE_ACTIVE",
            "crisis_event": {
                "scenario": "Peak Glut Crash in Vashi / Nashik Mandis",
                "crashed_mandi_price": f"₹{simulated_crash_price:.2f}/kg",
                "farmer_break_even": "₹14.50/kg",
                "risk": "Farmers facing catastrophic loss; produce dumping threatened"
            },
            "rescue_execution": {
                "target_processor": processor["name"],
                "facility_location": processor["location"],
                "guaranteed_contract_rate": f"₹{proc_rate:.2f}/kg",
                "batch_requirement_met": f"10.0 Metric Tonnes ({collective_volume_kg:,.0f} kg consolidated across 8 FPOs)",
                "intake_standard": processor["specifications"],
                "payment_guarantee": processor["payment_cycle"]
            },
            "financial_salvage_ledger": {
                "if_dumped_or_sold_in_crashed_mandi": f"₹{net_mandi_loss_scenario:,.2f}",
                "factory_gate_contract_payout": f"₹{net_factory_payout:,.2f}",
                "collective_wealth_salvaged": f"+₹{salvaged_delta:,.2f}",
                "net_farmer_protection": "Rescued 100% of 10-tonne harvest from highway dumping."
            },
            "fpo_allocations": fpo_batch_allocation
        }

glut_rescue_service = GlutRescueService()
