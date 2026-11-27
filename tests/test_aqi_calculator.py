"""
Unit Tests for Central Pollution Control Board (CPCB) NAQI Calculation Engine
"""

from backend.aqi_calculator import (
    calculate_sub_index,
    calculate_india_aqi,
    get_category_info,
)


def test_pm25_breakpoints():
    # Good (0 - 30 -> 0 - 50)
    assert calculate_sub_index(15.0, "pm2_5") == 25
    assert calculate_sub_index(30.0, "pm2_5") == 50

    # Satisfactory (31 - 60 -> 51 - 100)
    assert calculate_sub_index(45.0, "pm2_5") == 75
    assert calculate_sub_index(60.0, "pm2_5") == 100

    # Moderate (61 - 90 -> 101 - 200)
    assert calculate_sub_index(75.0, "pm2_5") == 150
    assert calculate_sub_index(90.0, "pm2_5") == 200

    # Poor (91 - 120 -> 201 - 300)
    assert calculate_sub_index(105.0, "pm2_5") == 250
    assert calculate_sub_index(120.0, "pm2_5") == 300

    # Very Poor (121 - 250 -> 301 - 400)
    assert calculate_sub_index(185.0, "pm2_5") == 350
    assert calculate_sub_index(250.0, "pm2_5") == 400

    # Severe (250+ -> 401 - 500)
    assert calculate_sub_index(300.0, "pm2_5") >= 401


def test_pm10_breakpoints():
    assert calculate_sub_index(25.0, "pm10") == 25
    assert calculate_sub_index(75.0, "pm10") == 75
    assert calculate_sub_index(175.0, "pm10") == 150
    assert calculate_sub_index(300.0, "pm10") == 250
    assert calculate_sub_index(390.0, "pm10") == 350
    assert calculate_sub_index(500.0, "pm10") >= 401


def test_dominant_pollutant_identification():
    # PM2.5 is high, others are low
    pollutants = {
        "pm2_5": 115.0,  # AQI ~283 (Poor)
        "pm10": 40.0,  # AQI 40 (Good)
        "no2": 20.0,  # AQI 25 (Good)
        "o3": 30.0,
        "so2": 15.0,
        "co": 0.5,
    }
    result = calculate_india_aqi(pollutants)
    assert result["category"] == "Poor"
    assert result["dominant_pollutant"] == "PM2.5"


def test_category_info_ranges():
    assert get_category_info(30)["category"] == "Good"
    assert get_category_info(80)["category"] == "Satisfactory"
    assert get_category_info(150)["category"] == "Moderate"
    assert get_category_info(250)["category"] == "Poor"
    assert get_category_info(350)["category"] == "Very Poor"
    assert get_category_info(450)["category"] == "Severe"


def test_null_and_negative_inputs():
    assert calculate_sub_index(-10.0, "pm2_5") is None
    assert calculate_sub_index(None, "pm2_5") is None
    assert calculate_sub_index(50.0, "unknown_pollutant") is None


def test_extreme_concentrations_and_secondary_pollutants():
    # Extreme PM2.5 > 500 ug/m3 caps at Severe 500
    sub_pm25 = calculate_sub_index(800.0, "pm2_5")
    assert sub_pm25 >= 401

    # NO2 breakpoints (0-40 -> 0-50, 41-80 -> 51-100)
    assert calculate_sub_index(20.0, "no2") == 25
    assert calculate_sub_index(60.0, "no2") == 75

    # SO2 breakpoints (0-40 -> 0-50, 41-80 -> 51-100)
    assert calculate_sub_index(20.0, "so2") == 25
    assert calculate_sub_index(60.0, "so2") == 75

    # CO breakpoints (0-1.0 -> 0-50, 1.1-2.0 -> 51-100)
    assert calculate_sub_index(0.5, "co") == 25
    assert calculate_sub_index(1.5, "co") == 75
