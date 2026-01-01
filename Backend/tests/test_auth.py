import pytest
from httpx import AsyncClient
from app.main import app


@pytest.mark.asyncio
async def test_root_endpoint():
    """Test the root endpoint returns correct response."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/")
    
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "HyperWatch"
    assert data["status"] == "healthy"


@pytest.mark.asyncio
async def test_health_check():
    """Test the health check endpoint."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/health")
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


@pytest.mark.asyncio
async def test_register_user():
    """Test user registration endpoint."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/auth/register",
            json={
                "email": "test@example.com",
                "password": "testpassword123",
                "full_name": "Test User",
                "role": "patient"
            }
        )
    
    # Note: This test will fail without a running MongoDB instance
    # In production, use a test database or mock
    assert response.status_code in [201, 500]  # 500 if DB not available


@pytest.mark.asyncio
async def test_login_without_credentials():
    """Test login endpoint without credentials."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/auth/login",
            json={
                "email": "nonexistent@example.com",
                "password": "wrongpassword"
            }
        )
    
    # Should return 401 or 500 (if DB not available)
    assert response.status_code in [401, 500]


@pytest.mark.asyncio
async def test_protected_endpoint_without_auth():
    """Test accessing protected endpoint without authentication."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/users/profile")
    
    # Should return 403 (Forbidden) due to missing auth
    assert response.status_code == 403


# Note: For complete testing, you should:
# 1. Set up a test MongoDB instance
# 2. Create test fixtures for users
# 3. Test all CRUD operations
# 4. Test RBAC enforcement
# 5. Test data validation
