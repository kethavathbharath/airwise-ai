"""
Comprehensive API Endpoints Test Suite for AirWise AI (PromptWars Challenge 06)
"""

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def test_health_endpoint():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert "service" in data
    assert "challenge" in data


def test_config_status_endpoint():
    res = client.get("/api/v1/config/status")
    assert res.status_code == 200
    data = res.json()
    assert "gemini_configured" in data
    assert "mode" in data


def test_city_search_hyderabad():
    res = client.get("/api/v1/cities/search?q=Hyderabad")
    assert res.status_code == 200
    cities = res.json()
    assert len(cities) > 0
    assert any("Hyderabad" in c["name"] for c in cities)


def test_city_search_empty_returns_defaults():
    res = client.get("/api/v1/cities/search?q=")
    assert res.status_code == 200
    cities = res.json()
    assert len(cities) > 0


def test_current_air_quality_hyderabad():
    res = client.get("/api/v1/air-quality/current?city=Hyderabad")
    assert res.status_code == 200
    data = res.json()
    assert data["city"] == "Hyderabad"
    assert "india_aqi" in data
    assert "pollutants" in data
    assert data["india_aqi"]["aqi"] > 0
    assert data["india_aqi"]["category"] in [
        "Good",
        "Satisfactory",
        "Moderate",
        "Poor",
        "Very Poor",
        "Severe",
    ]
    assert len(data["hourly_trend"]) > 0
    assert len(data["daily_forecast"]) > 0


def test_air_quality_coords_delhi():
    res = client.get("/api/v1/air-quality/coords?lat=28.6139&lon=77.2090&city=Delhi")
    assert res.status_code == 200
    data = res.json()
    assert data["city"] == "Delhi"
    assert data["india_aqi"]["aqi"] > 0


def test_coords_out_of_bounds_validation():
    res = client.get("/api/v1/air-quality/coords?lat=195.0&lon=77.2090")
    assert res.status_code == 422


def test_ai_chat_response():
    payload = {
        "messages": [
            {
                "role": "user",
                "content": "I live in Hyderabad and travel to college by bike. What should I do during severe pollution?",
            }
        ],
        "location": "Hyderabad",
        "current_aqi": 210,
        "pollutants": {"pm2_5": 95.0, "pm10": 160.0},
        "user_profile": {
            "name": "Bharath",
            "city": "Hyderabad",
            "transport_method": "Two-Wheeler / Bike",
            "lifestyle": "College Student",
        },
    }
    res = client.post("/api/v1/ai/chat", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "reply" in data
    assert len(data["reply"]) > 50
    assert "suggestions" in data


def test_ai_daily_routine_plan():
    payload = {
        "location": "Hyderabad",
        "aqi": 180,
        "user_profile": {
            "name": "Bharath",
            "transport_method": "Bike",
            "lifestyle": "Student",
        },
    }
    res = client.post("/api/v1/ai/daily-plan", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert len(data["morning"]) > 0
    assert len(data["afternoon"]) > 0
    assert len(data["evening"]) > 0
    assert data["estimated_daily_co2_reduction_kg"] > 0


def test_ai_indoor_guidance():
    payload = {
        "home_size": "2 BHK (800-1200 sq ft)",
        "occupants": 3,
        "ventilation_type": "Natural Windows & Balcony",
        "has_purifier": False,
        "outdoor_aqi": 165,
    }
    res = client.post("/api/v1/ai/indoor-advice", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "ventilation_status" in data
    assert "purifier_advice" in data
    assert "kitchen_safety" in data
    assert "indoor_plants_truth" in data


# Challenge 06 Explicit Alignment Aliases
def test_alias_daily_routine():
    res = client.post("/api/v1/recommendations/daily-routine", json={"location": "Delhi", "aqi": 220})
    assert res.status_code == 200
    assert len(res.json()["morning"]) > 0


def test_alias_indoor_air():
    res = client.post(
        "/api/v1/recommendations/indoor-air",
        json={
            "home_size": "3 BHK",
            "occupants": 4,
            "ventilation_type": "Windows",
            "has_purifier": True,
            "outdoor_aqi": 190,
        },
    )
    assert res.status_code == 200
    assert "purifier_advice" in res.json()


def test_alias_india_scale():
    res = client.get("/api/v1/air-quality/india-scale?city=Mumbai")
    assert res.status_code == 200
    assert res.json()["india_aqi"]["category"] in [
        "Good",
        "Satisfactory",
        "Moderate",
        "Poor",
        "Very Poor",
        "Severe",
    ]
