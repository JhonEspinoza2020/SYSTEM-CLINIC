"""Episodio 5 - Validación del motor de decisión clínica (PMV1/PMV2)."""
import pytest
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)

CASOS = [
    (
        {"edad": 30, "alergias_conocidas": "Ninguna", "tipo_sangre": "O+"},
        "BAJO",
    ),
    (
        {"edad": 70, "alergias_conocidas": "Penicilina", "tipo_sangre": "O+"},
        "ALTO",
    ),
    (
        {
            "edad": 40,
            "alergias_conocidas": "Ninguna",
            "tipo_sangre": "A+",
            "frecuencia_cardiaca": 120,
        },
        "ALTO",
    ),
    (
        {
            "edad": 25,
            "alergias_conocidas": "Ninguna",
            "tipo_sangre": "B+",
            "escala_glasgow": 7,
        },
        "ALTO",
    ),
]


@pytest.mark.parametrize("payload,riesgo_esperado", CASOS)
def test_evaluar_riesgo(payload, riesgo_esperado):
    res = client.post("/api/ia/evaluar-riesgo", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["riesgo_predicho"] == riesgo_esperado
    assert "recomendacion_ia" in data
    assert len(data["recomendacion_ia"]) > 5


def test_precision_casos_referencia():
    aciertos = sum(
        1
        for payload, esperado in CASOS
        if client.post("/api/ia/evaluar-riesgo", json=payload).json()["riesgo_predicho"] == esperado
    )
    precision = aciertos / len(CASOS)
    assert precision >= 0.85, f"Precisión {precision:.0%} por debajo del 85%"
