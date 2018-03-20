// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
import { encode } from '../../iris/utils/base64';

Cypress.Commands.add('auth', userId => {
  cy.setCookie(
    'session',
    encode(JSON.stringify({ passport: { user: userId } })),
    {
      httpOnly: true,
      secure: false,
    }
  );
  localStorage.setItem(
    'spectrum',
    JSON.stringify({ currentUser: { id: userId } })
  );
});
