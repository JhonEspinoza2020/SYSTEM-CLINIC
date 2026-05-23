import apiClient from '../api/client';

class PacienteService {
    obtenerTodosLosPacientes() {
        return apiClient.get('/api/pacientes/todos');
    }

    obtenerPacientesPorDoctor(idDoctor) {
        return apiClient.get(`/api/pacientes/doctor/${idDoctor}`);
    }

    registrarPaciente(paciente) {
        return apiClient.post('/api/pacientes', paciente);
    }

    actualizarPaciente(id, pacienteActualizado) {
        return apiClient.put(`/api/pacientes/${id}`, pacienteActualizado);
    }

    eliminarPaciente(id) {
        return apiClient.delete(`/api/pacientes/${id}`);
    }
}

export default new PacienteService();
