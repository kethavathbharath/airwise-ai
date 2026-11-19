import os
from contextlib import asynccontextmanager
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from .config import get_settings, update_gemini_key
from .services import air_quality_service, ai_service
from .models import (
    CitySearchResult,
    AirQualityReport,
    ChatRequest,
    ChatResponse,
    DailyPlanResponse,
    IndoorAdvisorRequest,
    IndoorAdvisorResponse,
    UserProfile,
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield

settings = get_settings()

app = FastAPI(
    title="AirWise AI – Your Personal Urban Air Quality Assistant",
    description="Intelligent air quality monitoring, personalized low-emission routines, and AI advisory.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "AirWise AI Backend",
        "gemini_active": bool(settings.gemini_api_key or os.getenv("GEMINI_API_KEY")),
        "mode": "gemini" if (settings.gemini_api_key or os.getenv("GEMINI_API_KEY")) else "intelligent_demo",
    }

@app.get("/api/v1/config/status")
async def get_config_status():
    has_gemini = bool(settings.gemini_api_key or os.getenv("GEMINI_API_KEY"))
    return {
        "gemini_configured": has_gemini,
        "mode": "Live Google Gemini AI" if has_gemini else "Intelligent Demo Mode",
        "notice": "Using live Gemini model" if has_gemini else "Running with AirWise Intelligent Fallback Model. You can enter a Gemini API key in Settings at any time.",
    }

@app.post("/api/v1/config/set-gemini-key")
async def set_gemini_key(payload: dict = Body(...)):
    key = payload.get("key", "").strip()
    update_gemini_key(key)
    return {
        "success": True,
        "gemini_configured": bool(key),
        "message": "Gemini API key updated successfully." if key else "Switched to Intelligent Demo Mode.",
    }

@app.get("/api/v1/cities/search", response_model=List[CitySearchResult])
async def search_cities(q: str = Query("", description="City search query")):
    return await air_quality_service.search_cities(q)

@app.get("/api/v1/air-quality/current", response_model=AirQualityReport)
async def get_current_air_quality(city: str = Query("Hyderabad", description="City name")):
    results = await air_quality_service.search_cities(city)
    if not results:
        raise HTTPException(status_code=404, detail=f"Location '{city}' could not be resolved.")
    target = results[0]
    return await air_quality_service.get_air_quality(
        lat=target.latitude,
        lon=target.longitude,
        city_name=target.name,
        country=target.country,
        region=target.admin1,
    )

@app.get("/api/v1/air-quality/coords", response_model=AirQualityReport)
async def get_air_quality_by_coords(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude"),
    city: Optional[str] = Query("Detected Location", description="City or location label"),
    country: Optional[str] = Query("India", description="Country name"),
    region: Optional[str] = Query(None, description="State / Region"),
):
    return await air_quality_service.get_air_quality(
        lat=lat,
        lon=lon,
        city_name=city,
        country=country,
        region=region,
    )

@app.post("/api/v1/ai/chat", response_model=ChatResponse)
async def ai_chat(req: ChatRequest):
    return await ai_service.chat(
        messages=req.messages,
        location=req.location,
        current_aqi=req.current_aqi,
        pollutants=req.pollutants,
        user_profile=req.user_profile,
    )

@app.post("/api/v1/ai/daily-plan", response_model=DailyPlanResponse)
async def ai_daily_plan(payload: dict = Body(...)):
    location = payload.get("location", "Hyderabad")
    aqi_val = payload.get("aqi", 165)
    raw_profile = payload.get("user_profile")
    user_profile = UserProfile(**raw_profile) if raw_profile else None
    return ai_service.generate_daily_routine_plan(location, aqi_val, user_profile)

@app.post("/api/v1/ai/indoor-advice", response_model=IndoorAdvisorResponse)
async def ai_indoor_advice(req: IndoorAdvisorRequest):
    return ai_service.generate_indoor_guidance(
        home_size=req.home_size,
        occupants=req.occupants,
        ventilation_type=req.ventilation_type,
        has_purifier=req.has_purifier,
        outdoor_aqi=req.outdoor_aqi,
    )

# Static files if built
frontend_dist = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", "dist")
if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

    @app.get("/")
    async def serve_root():
        return FileResponse(os.path.join(frontend_dist, "index.html"))

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api/") or full_path.startswith("health"):
            raise HTTPException(status_code=404, detail="Endpoint not found")
        file_path = os.path.join(frontend_dist, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
