/**
 * Episodio 2 - PMV2: Citas, panel doctor e IA
 */
describe('PMV2 - Citas e IA clínica', () => {
  it('doctor ve el panel de citas (WebSocket activo en UI)', () => {
    cy.loginDoctor();
    cy.get('[data-cy=panel-citas]').should('be.visible');
    cy.contains('Gestión de Citas Activas').should('be.visible');
  });

  it('paciente puede abrir modal de agendar cita', () => {
    cy.loginPaciente();
    cy.get('[data-cy=btn-agendar-cita]').click();
    cy.contains('Agendar').should('be.visible');
  });

  it('muestra análisis IA con recomendación clínica', () => {
    cy.loginDoctor();
    const dni = `8${Date.now().toString().slice(-7)}`;

    cy.get('[data-cy=nav-registrar]').click();
    cy.registrarPacienteCypress({
      dni,
      nombre: 'Ana',
      apellidoPaterno: 'Riesgo',
      alergias: 'Penicilina',
      edad: 70,
      temperatura: 37,
    });

    cy.get('[data-cy=nav-pacientes]').click();
    cy.get('[data-cy=buscar-paciente]').type(dni);
    cy.get('[data-cy=btn-analisis-ia]').first().click();
    cy.get('[data-cy=panel-analisis-ia]').should('be.visible');
    cy.get('[data-cy=texto-recomendacion-ia]').should('not.be.empty');
  });

  it('API de IA responde riesgo ALTO para alergia grave (Episodio 5)', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('iaUrl')}/api/ia/evaluar-riesgo`,
      body: {
        edad: 70,
        alergias_conocidas: 'Penicilina',
        tipo_sangre: 'O+',
        temperatura: 37,
      },
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.riesgo_predicho).to.eq('ALTO');
      expect(res.body.recomendacion_ia).to.match(/alerta|alergia/i);
    });
  });
});
