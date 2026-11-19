from fastapi import APIRouter
from datetime import datetime, timezone

router = APIRouter(prefix="/api/v1/test", tags=["test"])


@router.get("/mock-current")
async def mock_current():
    """Mock current air quality data for testing without API key."""
    return {
        "location": "London,UK",
        "coordinates": {"lat": 51.5074, "lon": -0.1278},
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "weather": {
            "temperature": 15.5,
            "feels_like": 14.2,
            "humidity": 72,
            "pressure": 1013,
            "wind_speed": 3.5,
            "wind_deg": 240,
            "description": "light rain",
            "icon": "10d",
        },
        "air_quality": {
            "aqi": 2,
            "co": 233.1,
            "no": 0.8,
            "no2": 18.4,
            "o3": 56.2,
            "so2": 2.1,
            "pm2_5": 8.5,
            "pm10": 12.3,
            "nh3": 1.2,
        },
    }


@router.get("/mock-forecast")
async def mock_forecast():
    """Mock forecast data for testing without API key."""
    base_time = datetime.now(timezone.utc)
    forecast = []
    for i in range(40):
        forecast.append({
            "timestamp": base_time.isoformat(),
            "aqi": 2,
            "pm2_5": 8.5,
            "pm10": 12.3,
            "o3": 56.2,
            "no2": 18.4,
            "so2": 2.1,
            "co": 233.1,
        })
    return {
        "location": "London,UK",
        "coordinates": {"lat": 51.5074, "lon": -0.1278},
        "forecast": forecast,
    }