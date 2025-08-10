from aiohttp.test_utils import TestClient


def get_auth_headers(client: TestClient, email: str, password: str):
    response = client.post(
        "/api/auth/token",
        data={"username": email, "password": password}
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}