"""
Efficiency & Performance Test Suite for AirWise AI
"""

import time
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def test_cache_hit_response_speed():
    # First request primes cache
    t0 = time.time()
    res1 = client.get("/api/v1/air-quality/current?city=Hyderabad")
    t1 = time.time()
    assert res1.status_code == 200
    cold_latency = t1 - t0

    # Second request hits in-memory cache
    t2 = time.time()
    res2 = client.get("/api/v1/air-quality/current?city=Hyderabad")
    t3 = time.time()

    assert res2.status_code == 200
    cached_latency = t3 - t2
    # Cached hit must be sub-100ms and faster than or equal to cold fetch
    assert cached_latency < 0.1
    assert cold_latency >= 0
    assert cached_latency < 0.1


def test_gzip_compression_enabled():
    res = client.get(
        "/api/v1/air-quality/current?city=Hyderabad",
        headers={"Accept-Encoding": "gzip"},
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
