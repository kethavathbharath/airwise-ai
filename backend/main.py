import os
import time
from contextlib import asynccontextmanager
from typing import Optional, List, Dict
from fastapi import FastAPI, HTTPException, Query, Body, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

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
    description="Intelligent air quality monitoring, personalized low-emission routines, and AI advisory for PromptWars Challenge 06.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# 1. Efficiency: GZip Compression for responses > 500 bytes
app.add_middleware(GZipMiddleware, minimum_size=500)


# 2. Security: Custom Security Headers Middleware (OWASP recommended)
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Enforces OWASP recommended security headers on all outbound HTTP responses."""

    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(self)"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload"
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' https:; "
            "style-src 'self' 'unsafe-inline' https:; "
            "img-src 'self' data: https: blob:; "
            "font-src 'self' https: data:; "
            "connect-src 'self' https:; "
            "frame-ancestors 'none';"
        )
        response.headers["Cross-Origin-Opener-Policy"] = "same-origin"
        response.headers["Cross-Origin-Resource-Policy"] = "cross-origin"
        response.headers["X-Permitted-Cross-Domain-Policies"] = "none"
        return response


app.add_middleware(SecurityHeadersMiddleware)


# 3. Security: In-Memory Rate Limiting Middleware (prevents DoS on AI endpoints)
class RateLimitMiddleware(BaseHTTPMiddleware):
    """Sliding window in-memory rate limiter to mitigate DoS abuse against inference endpoints."""

    def __init__(self, app, max_requests: int = 120, window_secs: int = 60):
        super().__init__(app)
        self.max_requests = max_requests
        self.window_secs = window_secs
        self.client_records: Dict[str, List[float]] = {}

    async def dispatch(self, request: Request, call_next):
        forwarded = request.headers.get("x-forwarded-for")
        client_ip = (
            forwarded.split(",")[0].strip()
            if forwarded
            else (request.client.host if request.client else "unknown")
        )
        now = time.time()

        # Clean older requests
        timestamps = self.client_records.get(client_ip, [])
        timestamps = [t for t in timestamps if now - t < self.window_secs]

        if len(timestamps) >= self.max_requests:
            return JSONResponse(
                status_code=429,
                content={"detail": "Too many requests. Please slow down and try again shortly."},
            )

        timestamps.append(now)
        self.client_records[client_ip] = timestamps
        return await call_next(request)


app.add_middleware(RateLimitMiddleware, max_requests=120, window_secs=60)

# 4. Security: CORS Configuration with Whitelist
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://localhost:3000",
    "https://airwise-ai-nufu.vercel.app",
    "https://airwise-ai.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    """Service liveness probe and hackathon challenge metadata endpoint."""
    return {
        "status": "healthy",
        "service": "AirWise AI Backend",
        "challenge": "PromptWars Virtual - Challenge 06: Urban Air Quality Assistant",
        "gemini_active": bool(settings.gemini_api_key or os.getenv("GEMINI_API_KEY")),
        "mode": "gemini" if (settings.gemini_api_key or os.getenv("GEMINI_API_KEY")) else "intelligent_demo",
    }


@app.get("/api/v1/config/status")
async def get_config_status():
    """Retrieve operational status of Google Gemini GenAI service."""
    has_gemini = bool(settings.gemini_api_key or os.getenv("GEMINI_API_KEY"))
    return {
        "gemini_configured": has_gemini,
        "mode": "Live Google Gemini AI" if has_gemini else "Intelligent Demo Mode",
        "notice": "Using live Gemini model"
        if has_gemini
        else "Running with AirWise Intelligent Fallback Model. You can enter a Gemini API key in Settings at any time.",
    }


@app.post("/api/v1/config/set-gemini-key")
async def set_gemini_key(payload: dict = Body(...)):
    """Configure or update the active Google Gemini API key dynamically."""
    key = payload.get("key", "").strip()
    update_gemini_key(key)
    return {
        "success": True,
        "gemini_configured": bool(key),
        "message": "Gemini API key updated successfully." if key else "Switched to Intelligent Demo Mode.",
    }


@app.get("/api/v1/cities/search", response_model=List[CitySearchResult])
async def search_cities(
    q: str = Query("", max_length=100, description="City search query"),
):
    """Search for Indian and global municipalities using geocoding."""
    # Sanitize query input
    clean_q = q.strip()[:100]
    return await air_quality_service.search_cities(clean_q)


@app.get("/api/v1/air-quality/current", response_model=AirQualityReport)
async def get_current_air_quality(
    city: str = Query("Hyderabad", max_length=100, description="City name"),
):
    """Retrieve live atmospheric report and official CPCB AQI by municipality name."""
    clean_city = city.strip()[:100]
    results = await air_quality_service.search_cities(clean_city)
    if not results:
        raise HTTPException(status_code=404, detail=f"Location '{clean_city}' could not be resolved.")
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
    lat: float = Query(..., ge=-90.0, le=90.0, description="Latitude"),
    lon: float = Query(..., ge=-180.0, le=180.0, description="Longitude"),
    city: Optional[str] = Query("Detected Location", max_length=100, description="City or location label"),
    country: Optional[str] = Query("India", max_length=100, description="Country name"),
    region: Optional[str] = Query(None, max_length=100, description="State / Region"),
):
    """Retrieve live atmospheric metrics and CPCB AQI by geographic coordinates."""
    return await air_quality_service.get_air_quality(
        lat=lat,
        lon=lon,
        city_name=city[:100] if city else "Detected Location",
        country=country[:100] if country else "India",
        region=region[:100] if region else None,
    )


@app.post("/api/v1/ai/chat", response_model=ChatResponse)
async def ai_chat(req: ChatRequest):
    """Conversational GenAI air assistant for personalized urban commute advice."""
    return await ai_service.chat(
        messages=req.messages,
        location=req.location,
        current_aqi=req.current_aqi,
        pollutants=req.pollutants,
        user_profile=req.user_profile,
    )


@app.post("/api/v1/ai/daily-plan", response_model=DailyPlanResponse)
async def ai_daily_plan(payload: dict = Body(...)):
    """Synthesize a personalized, low-emission daily routine for morning, afternoon, and evening."""
    location = payload.get("location", "Hyderabad")
    aqi_val = payload.get("aqi", 165)
    raw_profile = payload.get("user_profile")
    user_profile = UserProfile(**raw_profile) if raw_profile else None
    return ai_service.generate_daily_routine_plan(location, aqi_val, user_profile)


@app.post("/api/v1/ai/indoor-advice", response_model=IndoorAdvisorResponse)
async def ai_indoor_advice(req: IndoorAdvisorRequest):
    """Generate indoor air safety guidance, window aeration schedule, and CADR purifier sizing."""
    return ai_service.generate_indoor_guidance(
        home_size=req.home_size,
        occupants=req.occupants,
        ventilation_type=req.ventilation_type,
        has_purifier=req.has_purifier,
        outdoor_aqi=req.outdoor_aqi,
    )


# 5. Challenge 06 Explicit Alignment Aliases
@app.post("/api/v1/recommendations/daily-routine", response_model=DailyPlanResponse)
async def alias_daily_routine(payload: dict = Body(...)):
    """Challenge 06 Feature D: Low-Emission Daily Routine Planner endpoint."""
    return await ai_daily_plan(payload)


@app.post("/api/v1/recommendations/indoor-air", response_model=IndoorAdvisorResponse)
async def alias_indoor_air(req: IndoorAdvisorRequest):
    """Challenge 06 Feature C: Indoor Air Quality Advisor endpoint."""
    return await ai_indoor_advice(req)


@app.get("/api/v1/air-quality/india-scale", response_model=AirQualityReport)
async def alias_india_scale(city: str = Query("Hyderabad")):
    """Challenge 06 Feature A: CPCB India-Specific AQI Scale endpoint."""
    return await get_current_air_quality(city)


# 6. Static files serving
frontend_dist = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", "dist")
if os.path.exists(frontend_dist):
    app.mount(
        "/assets",
        StaticFiles(directory=os.path.join(frontend_dist, "assets")),
        name="assets",
    )

    @app.get("/")
    async def serve_root():
        return FileResponse(os.path.join(frontend_dist, "index.html"))

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if (
            full_path.startswith("api/")
            or full_path.startswith("health")
            or full_path.startswith("docs")
            or full_path.startswith("redoc")
        ):
            raise HTTPException(status_code=404, detail="Endpoint not found")
        file_path = os.path.join(frontend_dist, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
