import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert "service" in data

def test_config_status():
    res = client.get("/api/v1/config/status")
    assert res.status_code == 200
    data = res.json()
    assert "mode" in data
    assert "gemini_configured" in data

def test_city_search():
    res = client.get("/api/v1/cities/search?q=Hyderabad")
    assert res.status_code == 200
    cities = res.json()
    assert len(cities) > 0
    assert any("Hyderabad" in c["name"] for c in cities)

def test_air_quality_current():
    res = client.get("/api/v1/air-quality/current?city=Hyderabad")
    assert res.status_code == 200
    data = res.json()
    assert data["city"] == "Hyderabad"
    assert "india_aqi" in data
    assert "aqi" in data["india_aqi"]
    assert "category" in data["india_aqi"]
    assert "pollutants" in data
    assert data["pollutants"]["pm2_5"] is not None
    assert len(data["hourly_trend"]) > 0
    assert len(data["daily_forecast"]) > 0

def test_air_quality_coords():
    res = client.get("/api/v1/air-quality/coords?lat=28.6139&lon=77.2090&city=Delhi")
    assert res.status_code == 200
    data = res.json()
    assert data["city"] == "Delhi"
    assert "india_aqi" in data

def test_ai_chat_bike_commute():
    payload = {
        "messages": [
            {"role": "user", "content": "I live in Hyderabad and travel to college every day by bike. What should I do during severe pollution?"}
        ],
        "location": "Hyderabad",
        "current_aqi": 240,
        "pollutants": {"pm2_5": 95.0, "pm10": 180.0},
        "user_profile": {
            "name": "Bharath",
            "city": "Hyderabad",
            "transport_method": "Two-Wheeler / Bike",
            "lifestyle": "College Student"
        }
    }
    res = client.post("/api/v1/ai/chat", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "reply" in data
    assert len(data["reply"]) > 50
    assert "Travel Precautions" in data["reply"] or "mask" in data["reply"].lower()
    assert len(data["suggestions"]) > 0

def test_ai_daily_plan():
    payload = {
        "location": "Hyderabad",
        "aqi": 185,
        "user_profile": {
            "name": "Bharath",
            "transport_method": "Two-Wheeler / Bike",
            "lifestyle": "Student"
        }
    }
    res = client.post("/api/v1/ai/daily-plan", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert len(data["morning"]) > 0
    assert len(data["afternoon"]) > 0
    assert len(data["evening"]) > 0
    assert data["estimated_daily_co2_reduction_kg"] > 0

def test_ai_indoor_advice():
    payload = {
        "home_size": "2 BHK (800-1200 sq ft)",
        "occupants": 3,
        "ventilation_type": "Natural Windows",
        "has_purifier": False,
        "outdoor_aqi": 175
    }
    res = client.post("/api/v1/ai/indoor-advice", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "ventilation_status" in data
    assert "purifier_advice" in data
    assert "indoor_plants_truth" in data
    assert len(data["kitchen_safety"]) > 0

def test_spa_serving():
    res = client.get("/")
    assert res.status_code == 200
    assert "AirWise AI" in res.text or "<!doctype html>" in res.text

if __name__ == "__main__":
    pytest.main(["-v", "backend/test_full_app.py"])
