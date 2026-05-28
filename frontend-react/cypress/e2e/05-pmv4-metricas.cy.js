/**
 * Episodio 4 - Métricas con Cypress (tiempos + cobertura de flujos)
 */
const FLUJOS_CRITICOS = [
  'login-admin',
  'login-doctor',
  'panel-citas',
  'registro-paciente',
  'lista-pacientes',
  'analisis-ia-api',
];

describe('PMV4 - Métricas E2E', () => {
  const metricas = {};

  after(() => {
    const cubiertos = Object.values(metricas).filter(Boolean).length;
    const porcentaje = Math.round((cubiertos / FLUJOS_CRITICOS.length) * 100);
    cy.log('=== RESUMEN MÉTRICAS NOVASALUD ===');
    cy.log(`Flujos cubiertos: ${cubiertos}/${FLUJOS_CRITICOS.length} (${porcentaje}%)`);
    FLUJOS_CRITICOS.forEach((f) => cy.log(`${f}: ${metricas[f] ? 'OK' : 'FALTA'}`));
    cy.writeFile('cypress/reports/metricas-resumen.json', {
      fecha: new Date().toISOString(),
      flujos: metricas,
      porcentajeCoberturaFlujos: porcentaje,
    });
  });

  it('métrica: login API < 4000 ms', () => {
    cy.intercept('POST', '**/api/auth/login').as('loginApi');
    cy.visit('/');
    cy.get('[data-cy=login-correo]').type(Cypress.env('adminEmail'));
    cy.typeLoginPassword(Cypress.env('adminPassword'));
    cy.get('[data-cy=login-submit]').click();
    cy.wait('@loginApi').then((interception) => {
      const ms = interception.response.duration ?? 0;
      cy.log(`Login API: ${ms} ms`);
      expect(ms).to.be.lessThan(4000);
      metricas['login-admin'] = true;
    });
    cy.url().should('include', '/dashboard-admin');
  });

  it('métrica: login doctor y panel citas', () => {
    cy.loginDoctor();
    metricas['login-doctor'] = true;
    cy.get('[data-cy=panel-citas]').should('be.visible');
    metricas['panel-citas'] = true;
  });

  it('métrica: registro paciente vía UI', () => {
    cy.loginDoctor();
    cy.intercept('POST', '**/api/pacientes').as('crearPaciente');
    cy.get('[data-cy=nav-registrar]').click();
    cy.registrarPacienteCypress({ alergias: 'Ninguna', temperatura: 36.8 });
    cy.wait('@crearPaciente').then((interception) => {
      expect(interception.response.statusCode).to.be.oneOf([200, 201]);
      const ms = interception.response.duration ?? 0;
      cy.log(`POST paciente: ${ms} ms`);
      expect(ms).to.be.lessThan(5000);
      metricas['registro-paciente'] = true;
    });
    cy.get('[data-cy=nav-pacientes]').click();
    cy.get('[data-cy=tabla-pacientes]').should('be.visible');
    metricas['lista-pacientes'] = true;
  });

  it('métrica: microservicio IA < 2000 ms', () => {
    const inicio = Date.now();
    cy.request({
      method: 'POST',
      url: `${Cypress.env('iaUrl')}/api/ia/evaluar-riesgo`,
      body: { edad: 40, alergias_conocidas: 'Ninguna', tipo_sangre: 'A+' },
    }).then(() => {
      const ms = Date.now() - inicio;
      cy.log(`IA evaluar-riesgo: ${ms} ms`);
      expect(ms).to.be.lessThan(2000);
      metricas['analisis-ia-api'] = true;
    });
  });
});
