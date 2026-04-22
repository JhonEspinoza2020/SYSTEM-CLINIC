from fastapi import FastAPI
from pydantic import BaseModel

# Inicializamos el servidor rápido de Python
app = FastAPI()

# Definimos cómo debe lucir la información que nos enviará Java
class PacienteData(BaseModel):
    edad: int
    alergias_conocidas: str
    tipo_sangre: str

@app.get("/")
def home():
    return {"mensaje": "Microservicio de IA Médico Activo"}

@app.post("/api/ia/evaluar-riesgo")
def evaluar_riesgo(paciente: PacienteData):
    # Aquí es donde Scikit-learn haría la predicción compleja.
    # Para el PMV, simulamos el árbol de decisión:
    
    riesgo = "BAJO"
    recomendacion = "No se requieren precauciones especiales adicionales."

    alergias = paciente.alergias_conocidas.lower()

    # Reglas del modelo de evaluación
    if "ninguna" not in alergias and alergias.strip() != "":
        riesgo = "MEDIO"
        recomendacion = "Paciente con historial alérgico. Vigilar medicación."
        
        if paciente.edad > 60 or paciente.edad < 12:
            riesgo = "ALTO"
            recomendacion = "¡ALERTA PREVENTIVA! Paciente vulnerable con historial alérgico. Requiere supervisión estricta."

    return {
        "riesgo_predicho": riesgo,
        "recomendacion_ia": recomendacion
    }