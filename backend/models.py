"""
Pydantic Data Models and Schemas for AirWise AI
PromptWars Virtual - Challenge 06: Urban Air Quality Assistant
Provides typed schemas for requests, responses, atmospheric metrics, and AI recommendations.
"""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class CitySearchResult(BaseModel):
    """Geographic search result representing a city or metropolitan region."""

    id: Optional[int] = Field(None, description="Open-Meteo geographic identifier")
    name: str = Field(..., description="City or locality name")
    latitude: float = Field(..., description="Geographic latitude coordinate (-90 to 90)")
    longitude: float = Field(..., description="Geographic longitude coordinate (-180 to 180)")
    country: Optional[str] = Field("India", description="Sovereign nation name")
    admin1: Optional[str] = Field(None, description="Primary administrative subdivision or state")
    timezone: Optional[str] = Field("UTC", description="IANA regional timezone identifier")


class PollutantConcentrations(BaseModel):
    """Real-time ambient concentrations for key urban atmospheric pollutants."""

    pm2_5: Optional[float] = Field(None, description="Fine particulate matter (PM2.5) in µg/m³")
    pm10: Optional[float] = Field(None, description="Coarse respirable particulate matter (PM10) in µg/m³")
    no2: Optional[float] = Field(None, description="Nitrogen Dioxide concentration in µg/m³")
    o3: Optional[float] = Field(None, description="Ground-level tropospheric Ozone in µg/m³")
    so2: Optional[float] = Field(None, description="Sulphur Dioxide concentration in µg/m³")
    co: Optional[float] = Field(None, description="Carbon Monoxide concentration in µg/m³ or mg/m³")


class WeatherInfo(BaseModel):
    """Meteorological conditions and planetary boundary layer metrics."""

    temperature: Optional[float] = Field(None, description="Ambient surface dry-bulb temperature in °C")
    humidity: Optional[float] = Field(None, description="Relative surface atmospheric humidity percentage")
    wind_speed: Optional[float] = Field(None, description="Sustained surface wind velocity in km/h")
    wind_direction: Optional[float] = Field(None, description="Wind azimuth angle from meteorological North")
    condition: Optional[str] = Field("Clear", description="Qualitative meteorological condition descriptor")
    uv_index: Optional[float] = Field(None, description="Solar ultraviolet radiation index")


class AQIScaleDetail(BaseModel):
    """Indian Central Pollution Control Board (CPCB) NAQI calculation results."""

    aqi: int = Field(..., description="Calculated CPCB National Air Quality Index (0-500+)")
    category: str = Field(..., description="Official tier (Good, Satisfactory, Moderate, Poor, Very Poor, Severe)")
    color: str = Field(..., description="Hexadecimal CSS color representation for the active category")
    badge_class: str = Field(..., description="Tailwind CSS badge styling classes")
    description: str = Field(..., description="Health risk overview and biological vulnerability description")
    dominant_pollutant: str = Field(..., description="Key driving pollutant establishing the overall AQI")
    sub_indices: Dict[str, int] = Field(default_factory=dict, description="Calculated sub-index scores per pollutant")


class HourlyForecastItem(BaseModel):
    """Diurnal hourly air quality snapshot reflecting diurnal smog inversion dynamics."""

    time: str = Field(..., description="ISO 8601 timestamp or formatted clock hour")
    india_aqi: int = Field(..., description="Projected CPCB India AQI score")
    us_aqi: Optional[int] = Field(None, description="Equivalent US EPA AQI index")
    pm2_5: Optional[float] = Field(None, description="Projected PM2.5 concentration in µg/m³")
    pm10: Optional[float] = Field(None, description="Projected PM10 concentration in µg/m³")
    category: str = Field(..., description="Projected CPCB atmospheric category tier")
    color: str = Field(..., description="Associated color token")


class DailyForecastItem(BaseModel):
    """Multi-day atmospheric outlook and outdoor activity forecast."""

    date: str = Field(..., description="Calendar date (YYYY-MM-DD)")
    avg_aqi: int = Field(..., description="Estimated mean diurnal air quality index")
    max_aqi: int = Field(..., description="Peak expected inversion smog AQI")
    min_aqi: int = Field(..., description="Minimum diurnal AQI (typically midday aeration window)")
    category: str = Field(..., description="Predominant daily atmospheric classification tier")
    color: str = Field(..., description="Visual color token")
    recommendation: str = Field(..., description="Actionable outdoor planning and health protection guidance")


class AirQualityReport(BaseModel):
    """Complete atmospheric profile combining live feeds, CPCB metrics, and multi-day projections."""

    city: str = Field(..., description="Target locality or city name")
    region: Optional[str] = Field(None, description="State, province, or administrative region")
    country: Optional[str] = Field("India", description="Country name")
    latitude: float = Field(..., description="Latitude coordinate")
    longitude: float = Field(..., description="Longitude coordinate")
    timestamp: str = Field(..., description="ISO 8601 observation timestamp")
    data_freshness: str = Field(..., description="Human-readable data provenance and freshness label")
    is_live: bool = Field(True, description="Boolean flag verifying live telemetry feed")
    data_source: str = Field(
        "Open-Meteo Air Quality & CPCB India Standards", description="Atmospheric telemetry provenance documentation"
    )
    pollutants: PollutantConcentrations = Field(..., description="Concentration breakdown for six priority pollutants")
    india_aqi: AQIScaleDetail = Field(..., description="CPCB NAQI classification, sub-indices, and dominant pollutant")
    us_aqi: Optional[int] = Field(None, description="US EPA AQI equivalent value")
    weather: Optional[WeatherInfo] = Field(None, description="Surface weather and boundary layer conditions")
    hourly_trend: List[HourlyForecastItem] = Field(default_factory=list, description="24-hour diurnal trend data")
    daily_forecast: List[DailyForecastItem] = Field(default_factory=list, description="3-day predictive outlook")


class UserProfile(BaseModel):
    """Personalized commuter profile and residential configuration."""

    name: Optional[str] = Field("User", description="User preferred name")
    city: Optional[str] = Field("Hyderabad", description="Primary urban municipality")
    transport_method: Optional[str] = Field("Two-Wheeler / Bike", description="Primary daily commute modality")
    lifestyle: Optional[str] = Field("College Student / Commuter", description="Lifestyle and daily routine archetype")
    outdoor_frequency: Optional[str] = Field("Daily 2-3 hours", description="Daily outdoor exposure profile")
    home_size: Optional[str] = Field("2 BHK (800-1200 sq ft)", description="Residential footprint and apartment scale")
    occupants: Optional[int] = Field(3, description="Household occupant count")
    has_purifier: Optional[bool] = Field(False, description="True HEPA purifier ownership status")
    ventilation_type: Optional[str] = Field("Natural Windows & Balcony", description="Primary home ventilation method")


class ChatMessage(BaseModel):
    """Conversational interaction turn within the GenAI copilot session."""

    role: str = Field(..., description="Dialogue party role ('user', 'assistant', or 'system')")
    content: str = Field(..., description="Message text content")


class ChatRequest(BaseModel):
    """Inbound request payload for the conversational GenAI air assistant."""

    messages: List[ChatMessage] = Field(..., description="Chronological dialogue history")
    location: Optional[str] = Field(None, description="User current or selected urban location")
    current_aqi: Optional[int] = Field(None, description="Live ambient CPCB AQI value")
    pollutants: Optional[Dict[str, Any]] = Field(None, description="Live pollutant concentrations dictionary")
    user_profile: Optional[UserProfile] = Field(None, description="Personal commuter and household profile")


class ChatResponse(BaseModel):
    """Structured response synthesized by the GenAI copilot."""

    reply: str = Field(..., description="Actionable 5-point guidance response")
    model_used: str = Field(..., description="Inference engine descriptor (Gemini 2.0 or Neural Fallback)")
    mode: str = Field(..., description="Execution mode ('gemini' or 'intelligent_demo')")
    suggestions: List[str] = Field(default_factory=list, description="Contextual follow-up prompt chips")


class RoutineAction(BaseModel):
    """Actionable low-emission lifestyle recommendation within a diurnal schedule."""

    time_slot: str = Field(..., description="Target execution window (e.g., '7:00 AM - 8:30 AM')")
    title: str = Field(..., description="Succinct title of the recommended lifestyle action")
    action: str = Field(..., description="Explicit step-by-step guidance instructions")
    why_it_matters: str = Field(..., description="Scientific or health rationale for the action")
    environmental_benefit: str = Field(..., description="Emissions mitigation and avoided CO2 outcome")
    difficulty: str = Field(..., description="Practical implementation effort ('Easy', 'Medium', 'Challenging')")
    category: str = Field(..., description="Functional domain ('Commute', 'Indoor', 'Energy', 'Activity')")


class DailyPlanResponse(BaseModel):
    """Comprehensive personalized diurnal schedule across Morning, Afternoon, and Evening."""

    city: str = Field(..., description="Urban location name")
    aqi_level: str = Field(..., description="Qualitative ambient pollution level")
    overall_summary: str = Field(..., description="Executive meteorological and behavioral overview")
    morning: List[RoutineAction] = Field(default_factory=list, description="Morning actions (7:00 AM - 11:00 AM)")
    afternoon: List[RoutineAction] = Field(default_factory=list, description="Afternoon actions (11:00 AM - 4:00 PM)")
    evening: List[RoutineAction] = Field(default_factory=list, description="Evening actions (4:00 PM - 10:00 PM)")
    estimated_daily_co2_reduction_kg: float = Field(..., description="Estimated personal avoided CO2 emissions in kg")


class IndoorAdvisorRequest(BaseModel):
    """Configuration parameters for indoor air quality and ventilation guidance."""

    home_size: str = Field("2 BHK", description="Apartment or residential scale specification")
    occupants: int = Field(3, description="Total household occupants")
    ventilation_type: str = Field("Natural Windows", description="Primary home aeration mechanism")
    has_purifier: bool = Field(False, description="True HEPA air purifier ownership status")
    outdoor_aqi: int = Field(150, description="Real-time outdoor ambient CPCB AQI score")


class IndoorAdvisorResponse(BaseModel):
    """Tailored recommendations for maintaining a healthy indoor sanctuary during winter smog."""

    ventilation_status: str = Field(..., description="Window aeration safety status")
    ventilation_timing: str = Field(..., description="Recommended hours for safe indoor cross-ventilation")
    purifier_advice: Dict[str, Any] = Field(..., description="True HEPA (H13) CADR sizing and placement guidance")
    dust_reduction_tips: List[str] = Field(
        default_factory=list, description="Wet-mopping and electrostatic dust suppression techniques"
    )
    kitchen_safety: List[str] = Field(
        default_factory=list, description="Cooking PM2.5 mitigation (tadka/frying exhaust procedures)"
    )
    indoor_plants_truth: Dict[str, Any] = Field(
        ..., description="Scientific fact-check contextualizing chamber studies vs real home air changes"
    )
    filter_maintenance: List[str] = Field(
        default_factory=list, description="Pre-filter cleaning and HEPA saturation replacement schedules"
    )
