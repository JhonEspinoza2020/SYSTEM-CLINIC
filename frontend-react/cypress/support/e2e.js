import './commands';
import 'cypress-mochawesome-reporter/register';

Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('ResizeObserver') || err.message.includes('Loading chunk')) {
    return false;
  }
  return undefined;
});
