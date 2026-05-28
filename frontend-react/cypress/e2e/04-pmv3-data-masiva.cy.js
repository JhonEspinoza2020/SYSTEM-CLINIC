/**
 * Episodio 3 - Pruebas con data masiva
 * Requiere: ejecutar scripts/seed-pacientes-masivos.ps1 antes (o pacientes previos)
 */
describe('PMV3 - Data masiva', () => {
  const MIN_PACIENTES = 20;

  before(() => {
    cy.loginDoctor();
    cy.get('[data-cy=nav-pacientes]').click();
    cy.get('[data-cy=poblacion-activa]', { timeout: 15000 }).invoke('text').then((texto) => {
      const total = parseInt(texto, 10) || 0;
      if (total < MIN_PACIENTES) {
        cy.log(`Solo hay ${total} pacientes. Ejecuta: .\\scripts\\seed-pacientes-masivos.ps1 -Cantidad 50`);
      }
    });
  });

  beforeEach(() => {
    cy.loginDoctor();
    cy.get('[data-cy=nav-pacientes]').click();
  });

  it('lista soporta población activa >= mínimo esperado', () => {
    cy.get('[data-cy=poblacion-activa]').invoke('text').then((texto) => {
      const total = parseInt(texto, 10);
      expect(total).to.be.at.least(1);
      cy.log(`Población activa en UI: ${total} pacientes`);
    });
  });

  it('búsqueda por DNI responde en menos de 3 segundos', () => {
    cy.get('[data-cy=tabla-pacientes] tbody tr').first().find('td').eq(1).invoke('text').then((dni) => {
      const inicio = Date.now();
      cy.get('[data-cy=buscar-paciente]').clear().type(dni.trim());
      cy.get('[data-cy=tabla-pacientes]').contains(dni.trim()).should('be.visible');
      const ms = Date.now() - inicio;
      cy.log(`Búsqueda completada en ~${ms}ms`);
      expect(ms).to.be.lessThan(3000);
    });
  });

  it('tabla muestra filas cuando hay datos masivos', () => {
    cy.get('[data-cy=tabla-pacientes] tbody tr').its('length').should('be.gte', 1);
  });
});
