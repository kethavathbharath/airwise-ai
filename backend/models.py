from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class CitySearchResult(BaseModel):
    id: Optional[int] = None
    name: str
    latitude: float
    longitude: float
    country: Optional[str] = None
    admin1: Optional[str] = None
    timezone: Optional[str] = "UTC"

class PollutantConcentrations(BaseModel):
    pm2_5: Optional[float] = Field(None, description="PM2.5 in µg/m³")
    pm10: Optional[float] = Field(None, description="PM10 in µg/m³")
    no2: Optional[float] = Field(None, description="Nitrogen Dioxide in µg/m³")
    o3: Optional[float] = Field(None, description="Ozone in µg/m³")
    so2: Optional[float] = Field(None, description="Sulphur Dioxide in µg/m³")
    co: Optional[float] = Field(None, description="Carbon Monoxide in µg/m³")

class WeatherInfo(BaseModel):
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    wind_speed: Optional[float] = None
    wind_direction: Optional[float] = None
    condition: Optional[str] = "Clear"
    uv_index: Optional[float] = None

class AQIScaleDetail(BaseModel):
    aqi: int
    category: str
    color: str
    badge_class: str
    description: str
    dominant_pollutant: str
    sub_indices: Dict[str, int] = {}

class HourlyForecastItem(BaseModel):
    time: str
    india_aqi: int
    us_aqi: Optional[int] = None
    pm2_5: Optional[float] = None
    pm10: Optional[float] = None
    category: str
    color: str

class DailyForecastItem(BaseModel):
    date: str
    avg_aqi: int
    max_aqi: int
    min_aqi: int
    category: str
    color: str
    recommendation: str

class AirQualityReport(BaseModel):
    city: str
    region: Optional[str] = None
    country: Optional[str] = None
    latitude: float
    longitude: float
    timestamp: str
    data_freshness: str
    is_live: bool = True
    data_source: str = "Open-Meteo Air Quality & CPCB India Standards"
    pollutants: PollutantConcentrations
    india_aqi: AQIScaleDetail
    us_aqi: Optional[int] = None
    weather: Optional[WeatherInfo] = None
    hourly_trend: List[HourlyForecastItem] = []
    daily_forecast: List[DailyForecastItem] = []

class UserProfile(BaseModel):
    name: Optional[str] = "User"
    city: Optional[str] = "Hyderabad"
    transport_method: Optional[str] = "Two-Wheeler / Bike"
    lifestyle: Optional[str] = "College Student / Commuter"
    outdoor_frequency: Optional[str] = "Daily 2-3 hours"
    home_size: Optional[str] = "2 BHK (800-1200 sq ft)"
    occupants: Optional[int] = 3
    has_purifier: Optional[bool] = False
    ventilation_type: Optional[str] = "Natural Windows & Balcony"

class ChatMessage(BaseModel):
    role: str # 'user' or 'assistant' or 'system'
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    location: Optional[str] = None
    current_aqi: Optional[int] = None
    pollutants: Optional[Dict[str, Any]] = None
    user_profile: Optional[UserProfile] = None

class ChatResponse(BaseModel):
    reply: str
    model_used: str
    mode: str # 'gemini' or 'intelligent_demo'
    suggestions: List[str] = []

class RoutineAction(BaseModel):
    time_slot: str
    title: str
    action: str
    why_it_matters: str
    environmental_benefit: str
    difficulty: str # 'Easy', 'Medium', 'Challenging'
    category: str # 'Commute', 'Indoor', 'Energy', 'Activity'

class DailyPlanResponse(BaseModel):
    city: str
    aqi_level: str
    overall_summary: str
    morning: List[RoutineAction]
    afternoon: List[RoutineAction]
    evening: List[RoutineAction]
    estimated_daily_co2_reduction_kg: float

class IndoorAdvisorRequest(BaseModel):
    home_size: str = "2 BHK"
    occupants: int = 3
    ventilation_type: str = "Natural Windows"
    has_purifier: bool = False
    outdoor_aqi: int = 150

class IndoorAdvisorResponse(BaseModel):
    ventilation_status: str
    ventilation_timing: str
    purifier_advice: Dict[str, Any]
    dust_reduction_tips: List[str]
    kitchen_safety: List[str]
    indoor_plants_truth: Dict[str, Any]
    filter_maintenance: List[str]
