from fastapi.testclient import TestClient
from main import app  # ajuste conforme sua estrutura de projeto

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
