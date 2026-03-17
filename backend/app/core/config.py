from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-super-secret-key-for-jwt-tokens-here")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # DATABASE_URL: str = "postgresql://user:password@localhost:5432/sentinel_grc"
    # Using SQLite for easier development in this FYP environment, 
    # but the logic remains the same for PostgreSQL. 
    # To switch, just update the DATABASE_URL.
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./sentinel_grc.db")
    
    PROJECT_NAME: str = "Sentinel GRC"
    ALLOWED_HOSTS: List[str] = ["*"]
    
    # Secure file uploads path
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "./uploads")

    class Config:
        case_sensitive = True

settings = Settings()
