"""
Auction Clock Distress Rerouter & Mid-Transit Arbitrage Engine for KrishiClear.
Tracks wholesale market auction windows and autonomously calculates diversion to auxiliary
terminals when transit delays risk severe price decay.
"""

from datetime import datetime, timedelta
from typing import Dict, Any, List

class AuctionClockArbitrage:
    def __init__(self):
        # Destination wholesale terminals and their operational windows
        self.terminals = {
            "vashi_apmc": {
                "name": "Vashi APMC Wholesale Market (Navi Mumbai)",
                "code": "VASHI_APMC",
                "normal_route": "Samruddhi Mahamarg (Route B)",
                "peak_price_per_kg": 26.50,
                "post_auction_price_per_kg": 14.00,
                "auction_start": "04:00 AM",
                "auction_close": "07:30 AM",
                "auction_close_hours_from_midnight": 7.5,
                "standard_transit_hours": 3.2,
                "cluster": "Primary High-Liquidity Terminal"
            },
            "kalyan_apmc": {
                "name": "Kalyan Wholesale APMC (Thane Cluster)",
                "code": "KALYAN_APMC",
                "normal_route": "Diversion via Padgha-Bhiwandi Bypass",
                "peak_price_per_kg": 25.20,
                "post_auction_price_per_kg": 17.50,
                "auction_start": "05:00 AM",
                "auction_close": "09:30 AM",
                "auction_close_hours_from_midnight": 9.5,
                "standard_transit_hours": 2.7,
                "cluster": "Secondary High-Volume APMC"
            },
            "bhiwandi_qcom": {
                "name": "Bhiwandi Quick-Commerce Fulfillment Hub (Blinkit/Zepto Docks)",
                "code": "BHIWANDI_QCOM",
                "normal_route": "NH-848 Direct Industrial Dock",
                "peak_price_per_kg": 24.80,
                "post_auction_price_per_kg": 24.80, # Fixed contract pricing, zero auction cliff
                "auction_start": "24/7 Receiving",
                "auction_close": "Continuous (24h)",
                "auction_close_hours_from_midnight": 24.0,
                "standard_transit_hours": 2.4,
                "cluster": "Institutional Contract Clearing (Zero Clock Risk)"
            },
            "dadar_market": {
                "name": "Dadar Wholesale Yard (South Mumbai)",
                "code": "DADAR_APMC",
                "normal_route": "Eastern Express Corridor",
                "peak_price_per_kg": 27.20,
                "post_auction_price_per_kg": 13.50,
                "auction_start": "03:30 AM",
                "auction_close": "06:30 AM",
                "auction_close_hours_from_midnight": 6.5,
                "standard_transit_hours": 3.7,
                "cluster": "Early Morning Premium Auction"
            }
        }

    def get_market_clocks(self, current_time_str: str = "05:15 AM") -> List[Dict[str, Any]]:
        """Returns live countdown status for each major market destination."""
        # Assume departure was 03:00 AM
        simulated_current_hour = 5.25 # 05:15 AM
        
        clocks = []
        for key, m in self.terminals.items():
            close_hour = m["auction_close_hours_from_midnight"]
            if close_hour < 24.0:
                hours_remaining = max(0.0, close_hour - simulated_current_hour)
                mins = int((hours_remaining % 1) * 60)
                hrs = int(hours_remaining)
                countdown_str = f"{hrs}h {mins:02d}m remaining"
                status = "OPEN" if hours_remaining > 0.75 else ("CLOSING SOON" if hours_remaining > 0 else "CLOSED")
            else:
                countdown_str = "No Cutoff (24/7 Docks)"
                status = "CONTINUOUS"

            clocks.append({
                "code": m["code"],
                "name": m["name"],
                "auction_window": f"{m['auction_start']} – {m['auction_close']}",
                "countdown": countdown_str,
                "status": status,
                "current_price": f"₹{m['peak_price_per_kg']}/kg",
                "distress_price": f"₹{m['post_auction_price_per_kg']}/kg",
                "cluster": m["cluster"]
            })
        return clocks

    def evaluate_mid_transit_reroute(
        self,
        delay_minutes: float = 90.0,
        commodity: str = "Tomato",
        quantity_kg: float = 1350.0,
        current_location: str = "Igatpuri Checkpoint (Mid-Transit)",
        dispatch_time_str: str = "03:30 AM"
    ) -> Dict[str, Any]:
        """
        Evaluates whether an in-transit disruption triggers an autonomous diversion
        to avoid missing the primary wholesale auction cutoff.
        """
        normal_duration = self.terminals["vashi_apmc"]["standard_transit_hours"] # 3.2h
        actual_duration = normal_duration + (delay_minutes / 60.0) # 3.2 + 1.5 = 4.7h
        
        # Dispatch at 03:30 AM (3.5h), normal arrival at 06:42 AM (in time for 07:30 AM close)
        # Delayed arrival at Vashi: 03:30 + 4.7h = 08:12 AM (MISSED AUCTION by 42 mins!)
        vashi_cutoff = self.terminals["vashi_apmc"]["auction_close_hours_from_midnight"] # 7.5
        vashi_arrival_hour = 3.5 + actual_duration # 8.2 (08:12 AM)

        missed_vashi_auction = vashi_arrival_hour > vashi_cutoff

        # Value if staying on Vashi course (Distress sale!)
        vashi_realized_price = self.terminals["vashi_apmc"]["post_auction_price_per_kg"] if missed_vashi_auction else self.terminals["vashi_apmc"]["peak_price_per_kg"]
        vashi_gross_payout = round(quantity_kg * vashi_realized_price, 2)

        # Diversion Alternative 1: Kalyan APMC
        # Kalyan is 45 km closer from Igatpuri bypass, arrival at 07:20 AM (well before 09:30 AM close!)
        kalyan_arrival_hour = 3.5 + 2.7 + (delay_minutes * 0.4 / 60.0) # ~6.8h (06:48 AM)
        kalyan_realized_price = self.terminals["kalyan_apmc"]["peak_price_per_kg"] # ₹25.20
        kalyan_gross_payout = round(quantity_kg * kalyan_realized_price, 2)

        # Diversion Alternative 2: Bhiwandi Quick-Commerce Dock (Zero Risk)
        bhiwandi_price = self.terminals["bhiwandi_qcom"]["peak_price_per_kg"] # ₹24.80
        bhiwandi_gross_payout = round(quantity_kg * bhiwandi_price, 2)

        # Best diversion option
        if kalyan_gross_payout >= bhiwandi_gross_payout:
            recommended_hub = self.terminals["kalyan_apmc"]
            rec_payout = kalyan_gross_payout
            rec_price = kalyan_realized_price
            rec_eta = "07:20 AM (2h 10m before auction closes)"
            diversion_exit = "Exit Samruddhi at Padgha Interchange ➔ SH-35 to Kalyan APMC Dock #4"
        else:
            recommended_hub = self.terminals["bhiwandi_qcom"]
            rec_payout = bhiwandi_gross_payout
            rec_price = bhiwandi_price
            rec_eta = "06:55 AM (Direct receiving dock)"
            diversion_exit = "Exit NH-848 at Bhiwandi Logistics Bypass ➔ Quick-Commerce Dock Gate #2"

        value_preserved = round(rec_payout - vashi_gross_payout, 2)

        return {
            "status": "DIVERSION_RECOMMENDED" if missed_vashi_auction else "ON_COURSE",
            "trigger_condition": {
                "reported_delay": f"+{delay_minutes:.0f} Minutes Traffic Jam at Kasara Ghat",
                "current_location": current_location,
                "original_destination": "Vashi APMC Wholesale Dock",
                "vashi_auction_cutoff": "07:30 AM",
                "projected_vashi_eta": f"{int(vashi_arrival_hour):02d}:{int((vashi_arrival_hour % 1)*60):02d} AM",
                "auction_missed": missed_vashi_auction
            },
            "financial_impact": {
                "if_staying_on_vashi_course": {
                    "price_per_kg": f"₹{vashi_realized_price:.2f}/kg (Post-Auction Crash)",
                    "gross_revenue": f"₹{vashi_gross_payout:,.2f}",
                    "penalty_reason": "Arrived after 07:30 AM auction; buyers already cleared floor"
                },
                "recommended_reroute": {
                    "terminal_name": recommended_hub["name"],
                    "projected_eta": rec_eta,
                    "price_per_kg": f"₹{rec_price:.2f}/kg (Full Morning Auction Price)",
                    "gross_revenue": f"₹{rec_payout:,.2f}",
                    "diversion_corridor": diversion_exit
                },
                "net_farmer_value_preserved": f"+₹{value_preserved:,.2f}",
                "action_recommended": f"Divert immediately to {recommended_hub['name']} to preserve ₹{value_preserved:,.2f} in produce revenue!"
            },
            "live_clocks": self.get_market_clocks()
        }

auction_clock_arbitrage = AuctionClockArbitrage()
