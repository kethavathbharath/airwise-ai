"""
Security Test Suite for AirWise AI (OWASP Guidelines & Vulnerability Checks)
"""

import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_owasp_security_headers_present():
    res = client.get("/health")
    assert res.status_code == 200
    
    # Verify OWASP recommended security headers
    assert res.headers.get("X-Content-Type-Options") == "nosniff"
    assert res.headers.get("X-Frame-Options") == "DENY"
    assert res.headers.get("X-XSS-Protection") == "1; mode=block"
    assert res.headers.get("Referrer-Policy") == "strict-origin-when-cross-origin"
    assert "geolocation=(self)" in res.headers.get("Permissions-Policy", "")

def test_cors_origin_headers():
    res = client.options(
        "/api/v1/air-quality/current?city=Hyderabad",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "GET"
        }
    )
    assert res.status_code == 200
    assert res.headers.get("access-control-allow-origin") == "http://localhost:5173"

def test_invalid_api_path_returns_404():
    res = client.get("/api/v1/non-existent-endpoint")
    assert res.status_code == 404

def test_input_sanitization_long_strings():
    # Attempt buffer overflow or excessively long input
    long_string = "A" * 5000
    res = client.get(f"/api/v1/cities/search?q={long_string}")
    # Endpoint must handle gracefully without crashing or 500
    assert res.status_code in [200, 422]

def test_gemini_key_never_leaked_in_public_status():
    res = client.get("/api/v1/config/status")
    assert res.status_code == 200
    content = str(res.json())
    # Ensure raw secret keys are NEVER exposed in JSON response
    assert "AIzaSy" not in content
    assert "api_key" not in res.json()
