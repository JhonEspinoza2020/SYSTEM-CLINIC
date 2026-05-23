import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const obtenerDoctorSesion = () => {
    const raw = localStorage.getItem('usuarioLogueado') || localStorage.getItem('doctorLogueado');
    return raw ? JSON.parse(raw) : null;
};

export const generarPDFMaestro = (pacientesFiltrados, doctor) => {
    const doc = new jsPDF();
    doc.setFontSize(10); doc.setTextColor(0, 168, 204); doc.setFont('helvetica', 'bold');
    doc.text('NOVASALUD | RED HOSPITALARIA NACIONAL', 14, 12);
    doc.setFontSize(20); doc.setTextColor(26, 54, 93);
    doc.text('REPORTE CLÍNICO CONSOLIDADO', 105, 25, { align: 'center' });
    doc.setFontSize(11); doc.setTextColor(74, 85, 104); doc.setFont('helvetica', 'normal');
    doc.text(`Médico Responsable: Dr(a). ${doctor.nombreCompleto}`, 14, 38);
    doc.text(`Departamento: ${doctor.especialidad}`, 14, 44);
    doc.text(`Total de Pacientes: ${pacientesFiltrados.length}`, 140, 38);
    doc.text(`Fecha de Emisión: ${new Date().toLocaleDateString()}`, 140, 44);
    doc.setLineWidth(0.5); doc.setDrawColor(203, 213, 224);
    doc.line(14, 49, 196, 49);
    const tableRows = pacientesFiltrados.map(p => [
        p.historiaClinica ? p.historiaClinica.split(' | ')[0] : 'N/A',
        p.dni, `${p.nombre} ${p.apellidoPaterno}`, p.edad,
        p.sexo ? p.sexo.charAt(0) : '-', p.riesgoPredicho || 'N/E'
    ]);
    autoTable(doc, { head: [['Historia', 'DNI', 'Paciente', 'Edad', 'Sexo', 'Riesgo IA']], body: tableRows, startY: 55, theme: 'striped', headStyles: { fillColor: [26, 54, 93], textColor: 255 }, styles: { fontSize: 9, cellPadding: 3 } });
    const finalY = doc.lastAutoTable.finalY || 60;
    if (doctor.firmaDigital) {
        let posY = finalY + 20;
        if (posY > 250) { doc.addPage(); posY = 30; }
        doc.addImage(doctor.firmaDigital, 'PNG', 140, posY, 40, 20);
        doc.setFontSize(9); doc.setTextColor(0, 0, 0);
        doc.text('Firma del Médico Responsable', 140, posY + 25);
        doc.line(135, posY + 21, 185, posY + 21);
    }
    doc.save(`Reporte_NovaSalud_${doctor.nombreCompleto.replace(/\s/g, '_')}.pdf`);
};

export const generarPDFIndividual = (paciente, doctor) => {
    const doc = new jsPDF();
    doc.setFontSize(10); doc.setTextColor(0, 168, 204); doc.setFont('helvetica', 'bold');
    doc.text('NOVASALUD | SISTEMA DE EVALUACIÓN PREDICTIVA', 14, 12);
    doc.setFontSize(22); doc.setTextColor(26, 54, 93);
    doc.text('EXPEDIENTE CLÍNICO DIGITAL', 105, 25, { align: 'center' });
    doc.setFontSize(11); doc.setTextColor(100); doc.setFont('helvetica', 'normal');
    doc.text(`Especialista Tratante: Dr(a). ${doctor.nombreCompleto}`, 105, 33, { align: 'center' });
    let hcPura = paciente.historiaClinica || 'Sin asignar';
    let detallesExtras = '';
    if (hcPura.includes(' | ')) { const partes = hcPura.split(' | '); hcPura = partes[0]; detallesExtras = partes[1]; }
    const filasPDF = [
        ['Nombre Completo:', `${paciente.nombre} ${paciente.apellidoPaterno} ${paciente.apellidoMaterno}`],
        ['Identidad (DNI):', paciente.dni], ['N° de Historia Clínica:', hcPura],
        ['Fecha de Registro:', paciente.fechaRegistro || 'N/A'],
        ['Perfil Biológico:', `${paciente.edad} años | Sexo: ${paciente.sexo || 'N/A'} | Sangre: ${paciente.tipoSangre}`],
        ['Antecedentes Alérgicos:', paciente.alergiasConocidas || 'Negativo']
    ];
    if (detallesExtras) filasPDF.push(['DATOS DE ESPECIALIDAD:', detallesExtras]);
    autoTable(doc, { startY: 45, theme: 'plain', styles: { fontSize: 11, cellPadding: 4, textColor: [45, 55, 72] }, columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60, textColor: [26, 54, 93] } }, body: filasPDF });
    const finalY = doc.lastAutoTable.finalY || 120;
    doc.setDrawColor(26, 54, 93); doc.setFillColor(247, 250, 252);
    doc.roundedRect(14, finalY + 10, 182, 65, 4, 4, 'FD');
    doc.setFontSize(14); doc.setTextColor(229, 62, 62); doc.setFont('helvetica', 'bold');
    doc.text('VALIDACIÓN DE INTELIGENCIA ARTIFICIAL', 20, finalY + 22);
    doc.setFontSize(11); doc.setTextColor(45, 55, 72);
    doc.text(`Nivel de Riesgo Calculado: ${paciente.riesgoPredicho || 'Pendiente'}`, 20, finalY + 32);
    doc.text('Recomendación Médica Sugerida:', 20, finalY + 42);
    doc.setFont('helvetica', 'italic');
    doc.text(doc.splitTextToSize(`"${paciente.recomendacionIa || 'Analizando variables médicas...'}"`, 170), 20, finalY + 50);
    if (doctor.firmaDigital) {
        let posYFirma = finalY + 85;
        if (posYFirma > 250) { doc.addPage(); posYFirma = 30; }
        doc.addImage(doctor.firmaDigital, 'PNG', 140, posYFirma, 40, 20);
        doc.setFontSize(9); doc.setTextColor(0, 0, 0); doc.setFont('helvetica', 'normal');
        doc.text(`Firma Electrónica: Dr(a). ${doctor.nombreCompleto}`, 125, posYFirma + 25);
        doc.line(130, posYFirma + 21, 190, posYFirma + 21);
    }
    doc.save(`Expediente_${paciente.dni}_NovaSalud.pdf`);
};

export const calcularDatosGrafico = (pacientes) => {
    let alto = 0, medio = 0, bajo = 0, sinEvaluar = 0;
    pacientes.forEach(p => {
        if (p.riesgoPredicho === 'ALTO') alto++;
        else if (p.riesgoPredicho === 'MEDIO') medio++;
        else if (p.riesgoPredicho === 'BAJO') bajo++;
        else sinEvaluar++;
    });
    return [
        { name: 'Crítico (Alto)', value: alto, color: '#E53E3E' },
        { name: 'Observación (Medio)', value: medio, color: '#ED8936' },
        { name: 'Estable (Bajo)', value: bajo, color: '#38A169' },
        ...(sinEvaluar > 0 ? [{ name: 'Sin Datos', value: sinEvaluar, color: '#A0AEC0' }] : [])
    ];
};
