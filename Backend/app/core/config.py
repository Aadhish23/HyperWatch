from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    """
    # MongoDB Configuration
    MONGO_URI: str = "mongodb://localhost:27017/hyperwatch"
    MONGO_DB_NAME: str = "hyperwatch"
    
    # JWT Configuration
    JWT_SECRET: str = "CHANGE_ME_TO_A_SECURE_RANDOM_STRING"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60
    
    # CORS Configuration
    FRONTEND_URL: str = "http://localhost:3000"
    
    # Application Info
    APP_NAME: str = "HyperWatch"
    APP_VERSION: str = "1.0.0"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()
