"""
AirWise AI – Root Entrypoint for Vercel Serverless deployment.
"""
import sys
import os
from fastapi import FastAPI

# Add repository root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from backend.main import app

# Export app for Vercel runtime
__all__ = ["app"]
