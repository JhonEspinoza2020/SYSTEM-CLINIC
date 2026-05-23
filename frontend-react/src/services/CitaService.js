import apiClient from '../api/client';

const CitaService = {
    solicitar(cita) {
        return apiClient.post('/api/citas', cita);
    },
    listarPorDoctor(doctorId) {
        return apiClient.get(`/api/citas/doctor/${doctorId}`);
    },
    listarPorPaciente(pacienteId) {
        return apiClient.get(`/api/citas/paciente/${pacienteId}`);
    },
    actualizarEstado(id, estado, motivoRechazo = '') {
        return apiClient.put(`/api/citas/${id}/estado`, { estado, motivoRechazo });
    },
};

export default CitaService;
