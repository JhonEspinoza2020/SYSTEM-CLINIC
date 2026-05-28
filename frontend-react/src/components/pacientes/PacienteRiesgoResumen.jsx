import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const PacienteRiesgoResumen = ({ pacientes, datosGrafico }) => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: '20px', marginBottom: '30px' }}>
        <div className="card-resumen-nova" style={{ borderTopColor: '#00A8CC' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: '#718096' }}>POBLACIÓN ACTIVA</span>
            <h2 data-cy="poblacion-activa" style={{ fontSize: '42px', margin: '10px 0', color: '#1A365D' }}>{pacientes.length}</h2>
            <p style={{ margin: 0, color: '#A0AEC0', fontSize: '13px' }}>Expedientes registrados</p>
        </div>
        <div className="card-resumen-nova" style={{ borderTopColor: '#E53E3E' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: '#718096' }}>ALERTAS CRÍTICAS (IA)</span>
            <h2 style={{ fontSize: '42px', margin: '10px 0', color: '#E53E3E' }}>{datosGrafico[0]?.value || 0}</h2>
            <p style={{ margin: 0, color: '#A0AEC0', fontSize: '13px' }}>Casos de riesgo alto</p>
        </div>
        <div className="card-resumen-nova" style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 1, height: '140px' }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie data={datosGrafico} innerRadius={40} outerRadius={60} dataKey="value" stroke="none">
                            {datosGrafico.map((e, i) => <Cell key={i} fill={e.color} />)}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div style={{ paddingLeft: '25px', textAlign: 'left' }}>
                {datosGrafico.map(g => (
                    <div key={g.name} style={{ fontSize: '11px', marginBottom: '5px', color: '#4A5568', fontWeight: 'bold' }}>
                        <span style={{ color: g.color }}>●</span> {g.name}: {g.value}
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default PacienteRiesgoResumen;
