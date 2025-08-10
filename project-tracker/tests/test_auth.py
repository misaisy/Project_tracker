import pytest


@pytest.mark.asyncio
async def test_register_user_success(client):
    response = await client.post(
        "/api/auth/register",
        json={"email": "test@example.com", "password": "securepassword"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data


@pytest.mark.asyncio
async def test_register_duplicate_email(client):
    await client.post(
        "/api/auth/register",
        json={"email": "duplicate@example.com", "password": "password"}
    )

    response = await client.post(
        "/api/auth/register",
        json={"email": "duplicate@example.com", "password": "newpassword"}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"


@pytest.mark.asyncio
async def test_login_success(client):
    await client.post(
        "/api/auth/register",
        json={"email": "login@example.com", "password": "mypassword"}
    )

    response = await client.post(
        "/api/auth/token",
        data={"username": "login@example.com", "password": "mypassword"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_login_invalid_credentials(client):
    await client.post(
        "/api/auth/register",
        json={"email": "invalid@example.com", "password": "correct"}
    )

    response = await client.post(
        "/api/auth/token",
        data={"username": "invalid@example.com", "password": "wrong"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"


@pytest.mark.asyncio
async def test_login_unregistered_user(client):
    response = await client.post(
        "/api/auth/token",
        data={"username": "ghost@example.com", "password": "anypassword"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"