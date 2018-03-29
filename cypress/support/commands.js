// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
import { encode } from '../../api/utils/base64';

Cypress.Commands.add('auth', userId => {
  localStorage.setItem(
    'spectrum',
    JSON.stringify({ currentUser: { id: userId } })
  );
  return cy.setCookie(
    'session',
    encode(JSON.stringify({ passport: { user: userId } })),
    {
      httpOnly: true,
      secure: false,
    }
  );
});

Cypress.Commands.add('resetdb', () => {
  cy.exec(
    `node -e "const teardown = require('./shared/testing/teardown.js')().then(() => process.exit())"`
  );
  cy.exec(
    `node -e "const setup = require('./shared/testing/setup.js')().then(() => process.exit())"`
  );
});

Cypress.Commands.overwrite('type', (originalFn, $elem, text, options) => {
  const textarea = $elem[0];
  // If it's a DraftJS editor, simulate text events
  if (textarea.attributes.contenteditable) {
    var textEvent = document.createEvent('TextEvent');
    textEvent.initTextEvent('textInput', true, true, null, text);
    textarea.dispatchEvent(textEvent);
    return Promise.resolve($elem);
    // Else just use the vanilla .type
  } else {
    return originalFn($elem, text, options);
  }
});
