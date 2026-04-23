import axios from 'axios';

const API_URL = 'http://localhost:8080/api/pacientes';

class PacienteService {
    obtenerPacientes() { return axios.get(API_URL); }
    
    obtenerPacientesPorDoctor(idDoctor) { return axios.get(`${API_URL}/doctor/${idDoctor}`); }
    
    registrarPaciente(paciente) { return axios.post(API_URL, paciente); }

    // --- NUEVO MÉTODO PARA EDITAR ---
    actualizarPaciente(id, pacienteActualizado) {
        return axios.put(`${API_URL}/${id}`, pacienteActualizado);
    }
}

export default new PacienteService();