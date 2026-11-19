"""
Efficiency & Performance Test Suite for AirWise AI
"""

import time
import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_cache_hit_response_speed():
    # First request primes cache
    t0 = time.time()
    res1 = client.get("/api/v1/air-quality/current?city=Hyderabad")
    assert res1.status_code == 200
    
    # Second request hits in-memory cache
    t1 = time.time()
    res2 = client.get("/api/v1/air-quality/current?city=Hyderabad")
    t2 = time.time()
    
    assert res2.status_code == 200
    cached_latency = t2 - t1
    # Cached hit must be sub-100ms
    assert cached_latency < 0.1

def test_gzip_compression_enabled():
    res = client.get(
        "/api/v1/air-quality/current?city=Hyderabad",
        headers={"Accept-Encoding": "gzip"}
    )
    assert res.status_code == 200
    # Responses > 500 bytes are gzip compressed
    assert res.headers.get("content-encoding") == "gzip"

def test_city_search_caching():
    res1 = client.get("/api/v1/cities/search?q=Bengaluru")
    assert res1.status_code == 200
    
    t0 = time.time()
    res2 = client.get("/api/v1/cities/search?q=Bengaluru")
    t1 = time.time()
    assert res2.status_code == 200
    assert (t1 - t0) < 0.05
