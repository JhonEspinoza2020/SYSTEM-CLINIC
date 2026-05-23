import React from 'react';

const labelModalStyle = { fontWeight: '800', color: '#4A5568', fontSize: '11px', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' };
const inputModalStyle = { width: '100%', padding: '14px', border: '1.5px solid #E2E8F0', borderRadius: '10px', outline: 'none', background: '#F8FAFC', fontSize: '15px' };

const PacienteEditModal = ({ paciente, isSaving, onChange, onSave, onClose }) => (
    <div className="animacion-entrada" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(26, 54, 93, 0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '40px', borderRadius: '20px', width: '100%', maxWidth: '550px', textAlign: 'left', boxShadow: '0 25px 50px rgba(0,0,0,0.3)', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginTop: 0, color: '#1A365D', borderBottom: '2px solid #EDF2F7', paddingBottom: '15px', fontSize: '22px' }}>Actualizar Expediente Médico</h3>
            <p style={{ fontSize: '12px', color: '#718096', marginBottom: '25px' }}>DNI y N° Historia bloqueados por protocolos de integridad NovaSalud.</p>
            <form onSubmit={onSave}>
                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ flex: 1 }}><label style={labelModalStyle}>Nombres</label><input type="text" name="nombre" value={paciente.nombre} onChange={onChange} required style={inputModalStyle} disabled={isSaving} /></div>
                    <div style={{ flex: 1 }}><label style={labelModalStyle}>Apellidos</label><input type="text" name="apellidoPaterno" value={paciente.apellidoPaterno} onChange={onChange} required style={inputModalStyle} disabled={isSaving} /></div>
                </div>
                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ flex: 1 }}><label style={labelModalStyle}>Edad</label><input type="number" name="edad" value={paciente.edad} onChange={onChange} required style={inputModalStyle} disabled={isSaving} /></div>
                    <div style={{ flex: 1 }}>
                        <label style={labelModalStyle}>Género</label>
                        <select name="sexo" value={paciente.sexo || ''} onChange={onChange} required style={inputModalStyle} disabled={isSaving}>
                            <option value="Masculino">Masculino</option><option value="Femenino">Femenino</option>
                        </select>
                    </div>
                </div>
                <label style={labelModalStyle}>Alergias (crítico para IA)</label>
                <input type="text" list="sugerencias-alergias-editar" name="alergiasConocidas" value={paciente.alergiasConocidas} onChange={onChange} style={inputModalStyle} disabled={isSaving} />
                <datalist id="sugerencias-alergias-editar">
                    <option value="Ninguna" /><option value="Penicilina" /><option value="Látex" />
                </datalist>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '35px' }}>
                    <button type="button" onClick={onClose} disabled={isSaving} style={{ backgroundColor: '#CBD5E0', color: '#4A5568', border: 'none', padding: '14px 25px', borderRadius: '10px', cursor: 'pointer', fontWeight: '800' }}>Cancelar</button>
                    <button type="submit" disabled={isSaving} style={{ backgroundColor: isSaving ? '#718096' : '#00A8CC', color: '#FFFFFF', border: 'none', padding: '14px 25px', borderRadius: '10px', cursor: 'pointer', fontWeight: '800' }}>
                        {isSaving ? 'EVALUANDO...' : 'GUARDAR Y REEVALUAR IA'}
                    </button>
                </div>
            </form>
        </div>
    </div>
);

export default PacienteEditModal;
