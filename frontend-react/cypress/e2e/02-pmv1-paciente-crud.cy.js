/**
 * Episodio 1 - PMV1: CRUD paciente (doctor)
 */
describe('PMV1 - CRUD Paciente', () => {
  beforeEach(() => {
    cy.loginDoctor();
    cy.get('[data-cy=nav-registrar]').click();
    cy.get('[data-cy=form-paciente]').should('be.visible');
  });

  it('registra un paciente y lo encuentra en la lista', () => {
    const dni = `7${Date.now().toString().slice(-7)}`;
    cy.registrarPacienteCypress({
      dni,
      nombre: 'Juan',
      apellidoPaterno: 'Perez',
      alergias: 'Ninguna',
      temperatura: 36.5,
    });

    cy.get('[data-cy=nav-pacientes]').click();
    cy.get('[data-cy=buscar-paciente]').type(dni);
    cy.get('[data-cy=tabla-pacientes]').contains(dni).should('be.visible');
    cy.get('[data-cy=tabla-pacientes]').contains('Juan').should('be.visible');
  });
});
