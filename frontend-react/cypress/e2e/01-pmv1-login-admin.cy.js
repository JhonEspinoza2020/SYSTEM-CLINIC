/**
 * Episodio 1 - PMV1: Autenticación y acceso por rol
 */
describe('PMV1 - Login y seguridad', () => {
  it('admin inicia sesión y ve el panel administrativo', () => {
    cy.loginAdmin();
  });

  it('login con contraseña incorrecta muestra error', () => {
    cy.visit('/');
    cy.get('[data-cy=login-correo]').type(Cypress.env('adminEmail'));
    cy.typeLoginPassword('clave-incorrecta');
    cy.get('[data-cy=login-submit]').click();
    cy.contains(/incorrecta|inválid/i).should('be.visible');
  });

  it('doctor inicia sesión y accede al panel lateral', () => {
    cy.loginDoctor();
    cy.get('[data-cy=nav-citas]').should('be.visible');
    cy.get('[data-cy=nav-registrar]').should('be.visible');
    cy.get('[data-cy=nav-pacientes]').should('be.visible');
  });
});
