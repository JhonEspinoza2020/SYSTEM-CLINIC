import axios from 'axios';

// Esta es la URL de tu backend en Java
const API_URL = 'http://localhost:8080/api/pacientes';

class PacienteService {
    // Método para obtener todos los pacientes (GET)
    obtenerPacientes() {
        return axios.get(API_URL);
    }

    // Método para guardar un nuevo paciente (POST)
    registrarPaciente(paciente) {
        return axios.post(API_URL, paciente);
    }
}

export default new PacienteService();