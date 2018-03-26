// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

before(() => {
  cy.exec(
    `node -e "const teardown = require('./shared/testing/teardown.js')().then(() => process.exit())"`
  );
  cy.exec(
    `node -e "const setup = require('./shared/testing/setup.js')().then(() => process.exit())"`
  );
});
