import data from '../../../shared/testing/data';
const user = data.users[0];

describe.skip('can view delete controls in settings', () => {
  beforeEach(() => {
    cy.auth(user.id).then(() => cy.visit(`/users/${user.username}/settings`));
  });

  it('should render delete account section', () => {
    // scroll to delete account segment
    cy.get('[data-cy="user-settings"]').should('be.visible');

    cy.get('[data-cy="delete-account-container"]').scrollIntoView();

    cy.get('[data-cy="delete-account-container"]').should('be.visible');

    // should warn about owning communities since users[0] is max
    cy.get('[data-cy="owns-communities-notice"]').should('be.visible');

    // init delete
    cy.get('[data-cy="delete-account-init-button"]')
      .should('be.visible')
      .click();

    // should see option to confirm or cancel
    cy.get('[data-cy="delete-account-confirm-button"]').should('be.visible');
    // click cancel
    cy.get('[data-cy="delete-account-cancel-button"]')
      .should('be.visible')
      .click();

    // after canceling it should reset
    cy.get('[data-cy="delete-account-init-button"]')
      .should('be.visible')
      .click();

    // actually delete the account
    cy.get('[data-cy="delete-account-confirm-button"]')
      .should('be.visible')
      .click();

    // should sign out and go to home page
    cy.get('[data-cy="home-page"]').should('be.visible');

    // user should be deleted
    cy.visit(`/users/${user.username}`);
    cy.get('[data-cy="user-not-found"]').should('be.visible');
  });
});
