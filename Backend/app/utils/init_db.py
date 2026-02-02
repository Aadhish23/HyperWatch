"""
Database initialization and index creation script.
Run this script to set up MongoDB collections with proper indexes.
"""
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
import asyncio


async def create_indexes():
    """
    Create database indexes for optimal performance.
    """
    print("🔧 Creating database indexes...")
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client[settings.MONGO_DB_NAME]
    
    try:
        # Users collection indexes
        await db.users.create_index("email", unique=True)
        await db.users.create_index("role")
        await db.users.create_index([("created_at", -1)])
        print("✅ Users indexes created")
        
        # Patients collection indexes
        await db.patients.create_index("user_id", unique=True)
        await db.patients.create_index("device_id")
        print("✅ Patients indexes created")
        
        # Vitals collection indexes
        await db.vitals.create_index([("patient_id", 1), ("measured_at", -1)])
        await db.vitals.create_index([("measured_at", -1)])
        await db.vitals.create_index("patient_id")
        await db.vitals.create_index("is_anomaly")
        await db.vitals.create_index([("patient_id", 1), ("is_anomaly", 1)])
        print("✅ Vitals indexes created")
        
        # Alerts collection indexes
        await db.alerts.create_index([("patient_id", 1), ("created_at", -1)])
        await db.alerts.create_index([("patient_id", 1), ("is_read", 1)])
        await db.alerts.create_index([("patient_id", 1), ("is_resolved", 1)])
        await db.alerts.create_index("alert_type")
        await db.alerts.create_index([("alert_type", 1), ("is_resolved", 1)])
        await db.alerts.create_index([("created_at", -1)])
        print("✅ Alerts indexes created")
        
        print("✨ All indexes created successfully!")
        
    except Exception as e:
        print(f"❌ Error creating indexes: {e}")
    finally:
        client.close()


async def initialize_collections():
    """
    Initialize collections with validation rules.
    """
    print("🔧 Initializing database collections...")
    
    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client[settings.MONGO_DB_NAME]
    
    try:
        # Get existing collections
        existing_collections = await db.list_collection_names()
        
        # Create collections if they don't exist
        collections = ["users", "patients", "vitals", "alerts"]
        for collection in collections:
            if collection not in existing_collections:
                await db.create_collection(collection)
                print(f"✅ Created collection: {collection}")
            else:
                print(f"ℹ️  Collection already exists: {collection}")
        
        print("✨ Collections initialized successfully!")
        
    except Exception as e:
        print(f"❌ Error initializing collections: {e}")
    finally:
        client.close()


async def main():
    """
    Main function to run all initialization tasks.
    """
    print("="*50)
    print("🚀 HyperWatch Database Initialization")
    print("="*50)
    
    await initialize_collections()
    print()
    await create_indexes()
    
    print()
    print("="*50)
    print("✅ Database initialization complete!")
    print("="*50)


if __name__ == "__main__":
    asyncio.run(main())
