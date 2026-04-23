from fastapi import FastAPI
from pydantic import BaseModel

# Inicializamos el servidor de Inteligencia Artificial
app = FastAPI()

# Definimos exactamente qué datos nos envía Java
class PacienteData(BaseModel):
    edad: int
    alergias_conocidas: str
    tipo_sangre: str

@app.get("/")
def home():
    return {"mensaje": "Microservicio de IA Médico Activo y Escuchando"}

@app.post("/api/ia/evaluar-riesgo")
def evaluar_riesgo(paciente: PacienteData):
    # 1. Limpiamos y preparamos los datos recibidos
    edad = paciente.edad
    alergias = paciente.alergias_conocidas.lower().strip()
    tipo_sangre = paciente.tipo_sangre

    # 2. Valores por defecto (Paciente Sano)
    riesgo = "BAJO"
    recomendacion = "Paciente estable. No se requieren precauciones especiales adicionales."

    # 3. Identificamos si realmente hay alergias (ignorando palabras como "ninguna" o vacíos)
    tiene_alergias = alergias != "" and "ninguna" not in alergias and "no tiene" not in alergias
    
    # Lista de alergias que causan anafilaxia (riesgo mortal)
    alergias_graves = ["penicilina", "aines", "ibuprofeno", "anestesia", "latex", "látex", "mariscos"]
    tiene_alergia_grave = any(alergia_grave in alergias for alergia_grave in alergias_graves)

    # ==========================================
    # 🧠 MOTOR DE INFERENCIA (Árbol de Decisión)
    # ==========================================

    # Regla A: Extremos de edad (Bebés y Ancianos)
    if edad < 5 or edad > 65:
        riesgo = "MEDIO"
        recomendacion = "Requiere monitoreo estándar por encontrarse en rango de edad vulnerable."

    # Regla B: Alergias comunes
    if tiene_alergias:
        if riesgo == "BAJO": 
            riesgo = "MEDIO"
        recomendacion = "Paciente con historial alérgico leve. Verificar compatibilidad antes de recetar medicamentos."

    # Regla C: Alergias GRAVES detectadas (Sobreescribe todo a ALTO)
    if tiene_alergia_grave:
        riesgo = "ALTO"
        recomendacion = f"ALERTA ROJA: Posible reacción anafiláctica por alergia a {paciente.alergias_conocidas}. Usar medicación alternativa de forma obligatoria."

    # Regla D: Cruce de Datos Crítico (Edad vulnerable + Cualquier alergia)
    if (edad < 5 or edad > 65) and tiene_alergias:
        riesgo = "ALTO"
        recomendacion = "¡ALERTA PREVENTIVA CLÍNICA! Paciente vulnerable por edad con cuadro alérgico activo. Requiere supervisión médica estricta."

    # Regla E: Inteligencia adicional por Tipo de Sangre
    if tipo_sangre in ["AB-", "B-", "AB+"] and riesgo == "ALTO":
        recomendacion += " Nota Adicional: Paciente con tipo de sangre poco común. Asegurar reservas en banco de sangre en caso de intervención."

    # 4. Retornamos la decisión final a Java
    return {
        "riesgo_predicho": riesgo,
        "recomendacion_ia": recomendacion
    }