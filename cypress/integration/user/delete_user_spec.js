import data from '../../../shared/testing/data';
const user = data.users[0];

describe('can view delete controls in settings', () => {
  beforeEach(() => {
    cy.auth(user.id);
    cy.visit(`/users/${user.username}/settings`);
  });

  it('should render delete account section', () => {
    cy
      .get('[data-cy="delete-account-container"]')
      .scrollIntoView()
      .should('be.visible');
    cy.get('[data-cy="owns-communities-notice"]').should('be.visible');
    cy
      .get('[data-cy="delete-account-init-button"]')
      .should('be.visible')
      .click();

    cy.get('[data-cy="delete-account-confirm-button"]').should('be.visible');
    cy
      .get('[data-cy="delete-account-cancel-button"]')
      .should('be.visible')
      .click();

    cy
      .get('[data-cy="delete-account-confirm-button"]')
      .should('not.be.visible');
    cy
      .get('[data-cy="delete-account-init-button"]')
      .should('be.visible')
      .click();

    cy
      .get('[data-cy="delete-account-confirm-button"]')
      .should('be.visible')
      .click();

    cy.get('[data-cy="home-page"]').should('be.visible');

    cy.visit(`/users/${user.username}/settings`);
    cy.get('[data-cy="user-not-found"]').should('be.visible');
  });
});
