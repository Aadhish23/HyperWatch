from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings
from typing import Optional

# Global database client
mongo_client: Optional[AsyncIOMotorClient] = None


async def connect_to_mongo():
    """
    Connect to MongoDB on application startup.
    """
    global mongo_client
    try:
        mongo_client = AsyncIOMotorClient(
            settings.MONGO_URI,
            maxPoolSize=10,
            minPoolSize=1,
        )
        # Verify connection
        await mongo_client.admin.command('ping')
        print(f"✅ Connected to MongoDB: {settings.MONGO_DB_NAME}")
    except Exception as e:
        print(f"❌ Could not connect to MongoDB: {e}")
        raise e


async def close_mongo_connection():
    """
    Close MongoDB connection on application shutdown.
    """
    global mongo_client
    if mongo_client:
        mongo_client.close()
        print("🔌 Closed MongoDB connection")


def get_database() -> AsyncIOMotorDatabase:
    """
    Get the MongoDB database instance.
    
    Returns:
        AsyncIOMotorDatabase: MongoDB database
    """
    if not mongo_client:
        raise Exception("Database not initialized. Call connect_to_mongo() first.")
    return mongo_client[settings.MONGO_DB_NAME]


# Collection names
USERS_COLLECTION = "users"
PATIENTS_COLLECTION = "patients"
VITALS_COLLECTION = "vitals"
ALERTS_COLLECTION = "alerts"
