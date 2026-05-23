from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional

app = FastAPI()


class PacienteData(BaseModel):
    edad: int
    alergias_conocidas: str
    tipo_sangre: str
    peso_nacer: Optional[float] = None
    frecuencia_cardiaca: Optional[int] = None
    escala_glasgow: Optional[int] = None
    temperatura: Optional[float] = None
    nivel_dolor: Optional[int] = None


@app.get("/")
def home():
    return {"mensaje": "Microservicio de IA Médico Activo y Escuchando"}


@app.post("/api/ia/evaluar-riesgo")
def evaluar_riesgo(paciente: PacienteData):
    edad = paciente.edad
    alergias = paciente.alergias_conocidas.lower().strip()
    tipo_sangre = paciente.tipo_sangre

    riesgo = "BAJO"
    recomendacion = "Paciente estable. No se requieren precauciones especiales adicionales."

    tiene_alergias = alergias != "" and "ninguna" not in alergias and "no tiene" not in alergias
    alergias_graves = ["penicilina", "aines", "ibuprofeno", "anestesia", "latex", "látex", "mariscos"]
    tiene_alergia_grave = any(alergia_grave in alergias for alergia_grave in alergias_graves)

    if edad < 5 or edad > 65:
        riesgo = "MEDIO"
        recomendacion = "Requiere monitoreo estándar por encontrarse en rango de edad vulnerable."

    if tiene_alergias:
        if riesgo == "BAJO":
            riesgo = "MEDIO"
        recomendacion = "Paciente con historial alérgico. Verificar compatibilidad antes de recetar medicamentos."

    if tiene_alergia_grave:
        riesgo = "ALTO"
        recomendacion = f"ALERTA ROJA: Posible reacción anafiláctica por alergia a {paciente.alergias_conocidas}. Usar medicación alternativa."

    if (edad < 5 or edad > 65) and tiene_alergias:
        riesgo = "ALTO"
        recomendacion = "¡ALERTA PREVENTIVA! Paciente vulnerable con cuadro alérgico. Requiere supervisión médica estricta."

    if paciente.peso_nacer is not None:
        if paciente.peso_nacer < 2.5:
            riesgo = "ALTO"
            recomendacion = f"ALERTA NEONATAL: Bajo peso al nacer ({paciente.peso_nacer} kg). Requiere UCIN inmediata."
        elif paciente.peso_nacer > 4.0:
            riesgo = "MEDIO"
            recomendacion = f"Macrosomía fetal ({paciente.peso_nacer} kg). Monitorear glucosa."

    elif paciente.frecuencia_cardiaca is not None:
        if paciente.frecuencia_cardiaca > 100:
            riesgo = "ALTO"
            recomendacion = f"Taquicardia ({paciente.frecuencia_cardiaca} bpm). Realizar ECG de urgencia."
        elif paciente.frecuencia_cardiaca < 60:
            riesgo = "MEDIO"
            recomendacion = f"Bradicardia ({paciente.frecuencia_cardiaca} bpm). Evaluar ritmo sinusal."

    elif paciente.escala_glasgow is not None:
        if paciente.escala_glasgow <= 8:
            riesgo = "ALTO"
            recomendacion = f"Glasgow {paciente.escala_glasgow}/15. Preparar intubación y TAC urgente."
        elif paciente.escala_glasgow <= 12:
            riesgo = "MEDIO"
            recomendacion = f"Deterioro cognitivo moderado (Glasgow {paciente.escala_glasgow}/15)."

    elif paciente.temperatura is not None:
        if paciente.temperatura >= 39.5:
            riesgo = "ALTO"
            recomendacion = f"Hiperpirexia ({paciente.temperatura}°C). Aplicar antipiréticos y hemocultivo."
        elif paciente.temperatura <= 35.0:
            riesgo = "ALTO"
            recomendacion = f"Hipotermia ({paciente.temperatura}°C). Iniciar recalentamiento activo."

    if paciente.nivel_dolor is not None and paciente.nivel_dolor >= 8:
        if riesgo == "BAJO":
            riesgo = "MEDIO"
        recomendacion += f" || Dolor agudo (Nivel {paciente.nivel_dolor}/10). Priorizar analgesia."

    return {
        "riesgo_predicho": riesgo,
        "recomendacion_ia": recomendacion
    }
