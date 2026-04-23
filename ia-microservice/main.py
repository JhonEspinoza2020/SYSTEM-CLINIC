from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional 

# Inicializamos el servidor de Inteligencia Artificial
app = FastAPI()

# Definimos exactamente qué datos nos envía Java
class PacienteData(BaseModel):
    edad: int
    alergias_conocidas: str
    tipo_sangre: str
    # Nuevos campos opcionales. Eliminamos "especialidad" porque Java no lo envía, 
    # Python lo deducirá por los datos que lleguen.
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
    # 1. Limpiamos y preparamos los datos base
    edad = paciente.edad
    alergias = paciente.alergias_conocidas.lower().strip()
    tipo_sangre = paciente.tipo_sangre

    # 2. Valores por defecto (Paciente Sano)
    riesgo = "BAJO"
    recomendacion = "Paciente estable. No se requieren precauciones especiales adicionales."

    # 3. Identificamos alergias generales
    tiene_alergias = alergias != "" and "ninguna" not in alergias and "no tiene" not in alergias
    alergias_graves = ["penicilina", "aines", "ibuprofeno", "anestesia", "latex", "látex", "mariscos"]
    tiene_alergia_grave = any(alergia_grave in alergias for alergia_grave in alergias_graves)

    # ==========================================
    # 🧠 MOTOR DE INFERENCIA (Reglas Generales)
    # ==========================================

    if edad < 5 or edad > 65:
        riesgo = "MEDIO"
        recomendacion = "Requiere monitoreo estándar por encontrarse en rango de edad vulnerable."

    if tiene_alergias:
        if riesgo == "BAJO": riesgo = "MEDIO"
        recomendacion = "Paciente con historial alérgico. Verificar compatibilidad antes de recetar medicamentos."

    if tiene_alergia_grave:
        riesgo = "ALTO"
        recomendacion = f"ALERTA ROJA: Posible reacción anafiláctica por alergia a {paciente.alergias_conocidas}. Usar medicación alternativa."

    if (edad < 5 or edad > 65) and tiene_alergias:
        riesgo = "ALTO"
        recomendacion = "¡ALERTA PREVENTIVA! Paciente vulnerable con cuadro alérgico. Requiere supervisión médica estricta."

    # ==========================================
    # 🧬 MOTOR DE INFERENCIA AVANZADO (Especialidades)
    # ==========================================
    
    # Reglas para PEDIATRÍA (Si llega un peso, es un bebé)
    if paciente.peso_nacer is not None:
        if paciente.peso_nacer < 2.5:
            riesgo = "ALTO"
            recomendacion = f"ALERTA NEONATAL: Bajo peso al nacer ({paciente.peso_nacer} kg). Posible premadurez. Requiere incubadora y UCIN inmediata."
        elif paciente.peso_nacer > 4.0:
            riesgo = "MEDIO"
            recomendacion = f"Atención: Macrosomía fetal ({paciente.peso_nacer} kg). Monitorear glucosa estricta por riesgo de hipoglucemia."

    # Reglas para CARDIOLOGÍA (Si llega frecuencia cardiaca)
    elif paciente.frecuencia_cardiaca is not None:
        if paciente.frecuencia_cardiaca > 100:
            riesgo = "ALTO"
            recomendacion = f"ALERTA CARDIOLÓGICA: Taquicardia severa ({paciente.frecuencia_cardiaca} bpm). Realizar Electrocardiograma (ECG) de urgencia."
        elif paciente.frecuencia_cardiaca < 60:
            riesgo = "MEDIO"
            recomendacion = f"Precaución: Bradicardia detectada ({paciente.frecuencia_cardiaca} bpm). Evaluar ritmo sinusal."

    # Reglas para NEUROLOGÍA (Si llega escala de Glasgow)
    elif paciente.escala_glasgow is not None:
        if paciente.escala_glasgow <= 8:
            riesgo = "ALTO"
            recomendacion = f"CRÍTICO NEUROLÓGICO: Glasgow {paciente.escala_glasgow}/15. Coma o TCE grave. Preparar intubación y TAC urgente."
        elif paciente.escala_glasgow <= 12:
            riesgo = "MEDIO"
            recomendacion = f"Atención: Deterioro cognitivo moderado (Glasgow {paciente.escala_glasgow}/15). Mantener en observación."

    # Reglas para MEDICINA GENERAL (Si llega temperatura)
    elif paciente.temperatura is not None:
        if paciente.temperatura >= 39.5:
            riesgo = "ALTO"
            recomendacion = f"ALERTA INFECCIOSA: Hiperpirexia ({paciente.temperatura}°C). Aplicar antipiréticos IV y realizar hemocultivo."
        elif paciente.temperatura <= 35.0:
            riesgo = "ALTO"
            recomendacion = f"ALERTA HIPOTERMIA: Temperatura crítica ({paciente.temperatura}°C). Iniciar recalentamiento activo."

    # Reglas complementarias para TRAUMATOLOGÍA (El dolor puede acompañar a otras cosas)
    if paciente.nivel_dolor is not None:
        if paciente.nivel_dolor >= 8:
            if riesgo == "BAJO": riesgo = "MEDIO"
            recomendacion += f" || Prioridad de Triaje: Dolor agudo insoportable (Nivel {paciente.nivel_dolor}/10). Administrar analgesia fuerte inmediatamente."

    # 4. Retornamos la decisión final a Java
    return {
        "riesgo_predicho": riesgo,
        "recomendacion_ia": recomendacion
    }