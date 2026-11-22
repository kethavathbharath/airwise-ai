"""
Application Configuration and Settings Management for AirWise AI.
PromptWars Virtual - Challenge 06: Urban Air Quality Assistant
Loads environment variables securely with zero client-side secret exposure.
"""

import os
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime configuration settings for AirWise AI."""

    model_config = SettingsConfigDict(env_file=".env", extra="allow")

    app_name: str = "AirWise AI"
    debug: bool = False
    gemini_api_key: str = ""
    openweather_api_key: str = ""
    openmeteo_aqi_url: str = "https://air-quality-api.open-meteo.com/v1/air-quality"
    openmeteo_geo_url: str = "https://geocoding-api.open-meteo.com/v1/search"
    openmeteo_weather_url: str = "https://api.open-meteo.com/v1/forecast"


_settings_instance: Optional[Settings] = None


def get_settings() -> Settings:
    """Retrieve or initialize the singleton application settings instance."""
    global _settings_instance
    if _settings_instance is None:
        _settings_instance = Settings(
            gemini_api_key=os.getenv("GEMINI_API_KEY", ""),
            openweather_api_key=os.getenv("OPENWEATHER_API_KEY", ""),
        )
    return _settings_instance


def update_gemini_key(new_key: str) -> None:
    """Dynamically update the active Google Gemini API key in server runtime memory."""
    settings = get_settings()
    settings.gemini_api_key = new_key.strip()
