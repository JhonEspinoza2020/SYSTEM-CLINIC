import axios from 'axios';

const API_URL = 'http://localhost:8080/api/pacientes';

class PacienteService {
    // 🚀 CAMBIO: Agregamos /todos para que coincida con el controlador de Java
    obtenerTodosLosPacientes() { 
        return axios.get(`${API_URL}/todos`); 
    }
    
    obtenerPacientesPorDoctor(idDoctor) { 
        return axios.get(`${API_URL}/doctor/${idDoctor}`); 
    }
    
    registrarPaciente(paciente) { 
        return axios.post(API_URL, paciente); 
    }

    actualizarPaciente(id, pacienteActualizado) {
        return axios.put(`${API_URL}/${id}`, pacienteActualizado);
    }
}

export default new PacienteService();