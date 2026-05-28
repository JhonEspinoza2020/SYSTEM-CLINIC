/** Cierra SweetAlert2 si aparece */
Cypress.Commands.add('cerrarSwalSiVisible', () => {
  cy.get('body').then(($body) => {
    if ($body.find('.swal2-confirm').length) {
      cy.get('.swal2-confirm').click({ force: true });
    }
  });
});

/** El campo contraseña tiene readonly hasta focus (anti-autofill) */
Cypress.Commands.add('typeLoginPassword', (password) => {
  cy.get('[data-cy=login-password]')
    .click({ force: true })
    .clear({ force: true })
    .type(password, { force: true });
});

Cypress.Commands.add('loginAdmin', () => {
  cy.visit('/');
  cy.get('[data-cy=login-correo]').clear().type(Cypress.env('adminEmail'));
  cy.typeLoginPassword(Cypress.env('adminPassword'));
  cy.get('[data-cy=login-submit]').click();
  cy.url({ timeout: 20000 }).should('include', '/dashboard-admin');
  cy.get('[data-cy=dashboard-admin]').should('be.visible');
});

Cypress.Commands.add('loginDoctor', () => {
  cy.visit('/');
  cy.get('[data-cy=login-correo]').clear().type(Cypress.env('doctorEmail'));
  cy.typeLoginPassword(Cypress.env('doctorPassword'));
  cy.get('[data-cy=login-submit]').click();
  cy.get('[data-cy=doctor-confirmar-especialidad]', { timeout: 15000 }).click();
  cy.url({ timeout: 20000 }).should('include', '/dashboard/citas');
  cy.cerrarSwalSiVisible();
});

Cypress.Commands.add('loginPaciente', () => {
  cy.visit('/');
  cy.get('[data-cy=login-correo]').clear().type(Cypress.env('patientEmail'));
  cy.typeLoginPassword(Cypress.env('patientPassword'));
  cy.get('[data-cy=login-submit]').click();
  cy.url({ timeout: 20000 }).should('include', '/dashboard-paciente');
  cy.cerrarSwalSiVisible();
});

/** Registra un paciente en Medicina General (doctor cypress) */
Cypress.Commands.add('registrarPacienteCypress', (datos = {}) => {
  const dni = datos.dni || `${Math.floor(10000000 + Math.random() * 89999999)}`;
  cy.get('[data-cy=paciente-nombre]').clear().type(datos.nombre || 'Paciente');
  cy.get('[data-cy=paciente-apellido-paterno]').clear().type(datos.apellidoPaterno || 'Prueba');
  cy.get('[data-cy=paciente-apellido-materno]').clear().type(datos.apellidoMaterno || 'Cypress');
  cy.get('[data-cy=paciente-dni]').clear().type(dni);
  cy.get('[data-cy=paciente-edad]').clear().type(String(datos.edad ?? 35));
  cy.get('[data-cy=paciente-sexo]').select(datos.sexo || 'Masculino');
  cy.get('[data-cy=paciente-tipo-sangre]').select(datos.tipoSangre || 'O+');
  cy.get('[data-cy=paciente-alergias]').clear().type(datos.alergias || 'Ninguna');
  if (datos.temperatura) {
    cy.get('[data-cy=paciente-temperatura]').clear().type(String(datos.temperatura));
  }
  cy.get('[data-cy=paciente-submit]').click();
  cy.get('.swal2-confirm', { timeout: 20000 }).click();
  cy.wrap(dni).as('dniPaciente');
});

Cypress.Commands.add('medirTiempoApi', (alias, maxMs) => {
  cy.get(alias).then((interception) => {
    const ms = interception.response.duration;
    cy.log(`Tiempo ${alias}: ${ms} ms`);
    expect(ms, `respuesta bajo ${maxMs}ms`).to.be.lessThan(maxMs);
  });
});
