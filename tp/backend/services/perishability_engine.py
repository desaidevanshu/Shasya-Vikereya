"""
Perishability & Temperature Intelligence Engine.
Models crop-specific shelf-life decay as a function of transit time,
ambient temperature exposure, and crop vulnerability.
"""
import json
import os
import math
from typing import Dict, Any

CROP_PROFILES_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "crop_profiles.json")

class PerishabilityEngine:
    def __init__(self):
        with open(CROP_PROFILES_PATH, "r", encoding="utf-8") as f:
            self.profiles = json.load(f)

    def calculate_freshness(
        self,
        commodity: str,
        transit_duration_hours: float,
        ambient_temp_c: float,
        is_refrigerated: bool = False,
        hours_since_harvest: float = 6.0
    ) -> Dict[str, Any]:
        """
        Calculates remaining freshness % and quality status.
        """
        key = commodity.lower().split()[0]
        if key not in self.profiles:
            key = "tomato"

        profile = self.profiles[key]
        ideal_min = profile["ideal_temp_min_c"]
        ideal_max = profile["ideal_temp_max_c"]
        base_shelf_life = profile["base_shelf_life_hours"]
        decay_mult = profile["temp_decay_multiplier"]

        effective_transit_temp = ambient_temp_c
        if is_refrigerated:
            # Cold chain holds temperature at upper end of ideal band
            effective_transit_temp = ideal_max

        # Thermal stress factor (non-linear penalty for temperatures above ideal max)
        thermal_stress = 0.0
        if effective_transit_temp > ideal_max:
            excess = effective_transit_temp - ideal_max
            thermal_stress = excess * decay_mult * 1.5
        elif effective_transit_temp < ideal_min and key != "spinach":
            # Chilling injury risk for tropical fruits like tomato
            chilling_deficit = ideal_min - effective_transit_temp
            thermal_stress = chilling_deficit * decay_mult * 0.8

        # Total equivalent aging hours
        effective_hours = hours_since_harvest + (transit_duration_hours * (1.0 + thermal_stress))

        # Exponential decay model: Freshness = 100 * exp(-k * effective_hours / base_shelf_life)
        k = 0.85
        decay_ratio = (effective_hours / base_shelf_life) * k
        freshness_pct = max(5.0, min(100.0, 100.0 * math.exp(-decay_ratio)))
        freshness_pct = round(freshness_pct, 1)

        # Classify status
        if freshness_pct >= 78.0:
            status = "SAFE"
            badge_color = "emerald"
            action = "Approved for premium direct retail and institutional dispatch."
        elif freshness_pct >= 55.0:
            status = "WATCH"
            badge_color = "amber"
            action = "Expedited transit advised; route buffer tightened."
        else:
            status = "CRITICAL"
            badge_color = "rose"
            action = "WASTE RESCUE TRIGGERED: Divert to nearby ketchup/food processor hub."

        temp_deviation = round(effective_transit_temp - ideal_max, 1) if effective_transit_temp > ideal_max else 0.0
        cold_chain_recommended = temp_deviation > 8.0 or key == "spinach"

        return {
            "commodity": profile["name"],
            "category": profile["category"],
            "ideal_temp_band": f"{ideal_min}°C - {ideal_max}°C",
            "ambient_temp_c": ambient_temp_c,
            "effective_transit_temp_c": effective_transit_temp,
            "is_refrigerated": is_refrigerated,
            "transit_duration_hours": round(transit_duration_hours, 1),
            "hours_since_harvest": hours_since_harvest,
            "freshness_pct": freshness_pct,
            "freshness_status": status,
            "badge_color": badge_color,
            "shelf_life_remaining_hours": max(0.0, round(base_shelf_life - effective_hours, 1)),
            "thermal_stress_index": round(thermal_stress, 2),
            "cold_chain_recommended": cold_chain_recommended,
            "recommendation": action
        }

perishability_engine = PerishabilityEngine()
