import axios from 'axios';

const API_URL = 'http://localhost:8080/api/pacientes';

class PacienteService {
    // Método clásico (ya no lo usaremos en el dashboard privado, pero lo dejamos por si acaso)
    obtenerPacientes() {
        return axios.get(API_URL);
    }

    // --- NUEVO MÉTODO: Traer solo los pacientes del doctor en sesión ---
    obtenerPacientesPorDoctor(idDoctor) {
        return axios.get(`${API_URL}/doctor/${idDoctor}`);
    }

    // Método para guardar un nuevo paciente
    registrarPaciente(paciente) {
        return axios.post(API_URL, paciente);
    }
}

export default new PacienteService();