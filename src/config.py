# config.py
import os

# Constants
DEFAULT_SYSTEM_PROMPT = "You are Weapons officer, who can identify military items accurately. Keep response to a single line, identify the weapon and its type"

# Environment configuration
API_KEY = os.getenv("DWANI_API_KEY", "your-api-key-here")
BASE_URL = os.getenv("DWANI_API_BASE_URL", "https://your-custom-endpoint.com/v1")