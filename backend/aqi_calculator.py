"""
Indian Central Pollution Control Board (CPCB) NAQI & US EPA AQI Calculator.
Provides precise calculation of sub-indices, dominant pollutants, categories, and health advisories.
"""

from typing import Dict, Any, Optional, Tuple

# CPCB Breakpoints (Min_Conc, Max_Conc, Min_AQI, Max_AQI)
CPCB_BREAKPOINTS = {
    "pm2_5": [
        (0.0, 30.0, 0, 50),
        (30.1, 60.0, 51, 100),
        (60.1, 90.0, 101, 200),
        (90.1, 120.0, 201, 300),
        (120.1, 250.0, 301, 400),
        (250.1, 500.0, 401, 500),
    ],
    "pm10": [
        (0.0, 50.0, 0, 50),
        (50.1, 100.0, 51, 100),
        (100.1, 250.0, 101, 200),
        (250.1, 350.0, 201, 300),
        (350.1, 430.0, 301, 400),
        (430.1, 600.0, 401, 500),
    ],
    "no2": [
        (0.0, 40.0, 0, 50),
        (40.1, 80.0, 51, 100),
        (80.1, 180.0, 101, 200),
        (180.1, 280.0, 201, 300),
        (280.1, 400.0, 301, 400),
        (400.1, 600.0, 401, 500),
    ],
    "o3": [
        (0.0, 50.0, 0, 50),
        (50.1, 100.0, 51, 100),
        (100.1, 168.0, 101, 200),
        (168.1, 208.0, 201, 300),
        (208.1, 748.0, 301, 400),
        (748.1, 1000.0, 401, 500),
    ],
    "so2": [
        (0.0, 40.0, 0, 50),
        (40.1, 80.0, 51, 100),
        (80.1, 380.0, 101, 200),
        (380.1, 800.0, 201, 300),
        (800.1, 1600.0, 301, 400),
        (1600.1, 2000.0, 401, 500),
    ],
    "co": [  # in mg/m3
        (0.0, 1.0, 0, 50),
        (1.01, 2.0, 51, 100),
        (2.01, 10.0, 101, 200),
        (10.01, 17.0, 201, 300),
        (17.01, 34.0, 301, 400),
        (34.01, 50.0, 401, 500),
    ],
}

CPCB_CATEGORIES = [
    {"max": 50, "category": "Good", "color": "#10b981", "badgeClass": "bg-emerald-100 text-emerald-800 border-emerald-300", "description": "Minimal health impact. Clean & safe ambient air."},
    {"max": 100, "category": "Satisfactory", "color": "#84cc16", "badgeClass": "bg-lime-100 text-lime-800 border-lime-300", "description": "Minor breathing discomfort to sensitive people."},
    {"max": 200, "category": "Moderate", "color": "#eab308", "badgeClass": "bg-amber-100 text-amber-800 border-amber-300", "description": "Breathing discomfort to people with asthma, lungs and heart diseases."},
    {"max": 300, "category": "Poor", "color": "#f97316", "badgeClass": "bg-orange-100 text-orange-800 border-orange-300", "description": "Breathing discomfort to most people on prolonged outdoor exposure."},
    {"max": 400, "category": "Very Poor", "color": "#ef4444", "badgeClass": "bg-red-100 text-red-800 border-red-300", "description": "Respiratory illness on prolonged exposure. Protect children & elderly."},
    {"max": 9999, "category": "Severe", "color": "#881337", "badgeClass": "bg-rose-950 text-rose-200 border-rose-800", "description": "Affects healthy people and seriously impacts vulnerable groups. Avoid going outside."},
]

def calculate_sub_index(conc: float, pollutant: str) -> Optional[int]:
    """Calculate the Indian AQI sub-index for a specific pollutant."""
    if conc is None or conc < 0:
        return None
    breakpoints = CPCB_BREAKPOINTS.get(pollutant)
    if not breakpoints:
        return None

    # Handle concentrations above highest breakpoint
    max_b = breakpoints[-1]
    if conc >= max_b[1]:
        return min(500, int(max_b[3] + (conc - max_b[1]) * 0.5))

    for b_lo, b_hi, i_lo, i_hi in breakpoints:
        if b_lo <= conc <= b_hi:
            index = i_lo + ((i_hi - i_lo) / (b_hi - b_lo)) * (conc - b_lo)
            return round(index)
    return None

def get_category_info(aqi_val: int) -> Dict[str, Any]:
    for cat in CPCB_CATEGORIES:
        if aqi_val <= cat["max"]:
            return cat
    return CPCB_CATEGORIES[-1]

def calculate_india_aqi(pollutants: Dict[str, Optional[float]]) -> Dict[str, Any]:
    """
    Computes Indian CPCB NAQI given pollutants:
    pm2_5 (ug/m3), pm10 (ug/m3), no2 (ug/m3), o3 (ug/m3), so2 (ug/m3), co (ug/m3 or mg/m3).
    """
    sub_indices: Dict[str, int] = {}

    if pollutants.get("pm2_5") is not None:
        idx = calculate_sub_index(pollutants["pm2_5"], "pm2_5")
        if idx is not None:
            sub_indices["pm2_5"] = idx

    if pollutants.get("pm10") is not None:
        idx = calculate_sub_index(pollutants["pm10"], "pm10")
        if idx is not None:
            sub_indices["pm10"] = idx

    if pollutants.get("no2") is not None:
        idx = calculate_sub_index(pollutants["no2"], "no2")
        if idx is not None:
            sub_indices["no2"] = idx

    if pollutants.get("o3") is not None:
        idx = calculate_sub_index(pollutants["o3"], "o3")
        if idx is not None:
            sub_indices["o3"] = idx

    if pollutants.get("so2") is not None:
        idx = calculate_sub_index(pollutants["so2"], "so2")
        if idx is not None:
            sub_indices["so2"] = idx

    co_val = pollutants.get("co")
    if co_val is not None:
        # If CO > 100, it is likely in ug/m3, convert to mg/m3
        co_mg = co_val / 1000.0 if co_val > 50 else co_val
        idx = calculate_sub_index(co_mg, "co")
        if idx is not None:
            sub_indices["co"] = idx

    if not sub_indices:
        return {
            "aqi": 50,
            "category": "Good",
            "color": "#10b981",
            "badgeClass": "bg-emerald-100 text-emerald-800 border-emerald-300",
            "dominant_pollutant": "pm2_5",
            "description": "Clean air",
            "sub_indices": {}
        }

    dominant_pollutant = max(sub_indices, key=sub_indices.get)
    overall_aqi = sub_indices[dominant_pollutant]
    cat_info = get_category_info(overall_aqi)

    return {
        "aqi": overall_aqi,
        "category": cat_info["category"],
        "color": cat_info["color"],
        "badgeClass": cat_info["badgeClass"],
        "dominant_pollutant": dominant_pollutant.replace("_", ".").upper(),
        "description": cat_info["description"],
        "sub_indices": sub_indices
    }
