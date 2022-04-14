import data from '../../../shared/testing/data';

const user = data.users[0];

const NEW_NAME = 'Brian Edited';
const NEW_DESCRIPTION = 'Description Edited';
const NEW_WEBSITE = 'Website Edited';
const NEW_USERNAME = 'brian-edited';

describe('edit a user', () => {
  beforeEach(() => {
    cy.auth(user.id).then(() => cy.visit(`/me/settings`));
  });

  it('should edit a user', () => {
    cy.get('[data-cy="user-edit-form"]').should('be.visible');

    cy.get('[data-cy="user-name-input"]')
      .should('be.visible')
      .click()
      .clear()
      .type(NEW_NAME);

    cy.get('[data-cy="user-username-input"]')
      .should('be.visible')
      .click()
      .clear()
      .type(NEW_USERNAME);

    cy.get('[data-cy="user-description-input"]')
      .should('be.visible')
      .click()
      .clear()
      .type(NEW_DESCRIPTION);

    cy.get('[data-cy="user-email-input"]').should('be.visible');

    cy.get('[data-cy="user-website-input"]')
      .should('be.visible')
      .click()
      .clear()
      .type(NEW_WEBSITE);

    cy.get('[data-cy="save-button"]')
      .should('be.visible')
      .click();

    cy.visit(`/users/${NEW_USERNAME}`);
    cy.get('[data-cy="user-view"]').should('be.visible');
    cy.get('[data-cy="user-view"]').contains(NEW_NAME);
    cy.get('[data-cy="user-view"]').contains(NEW_DESCRIPTION);
    cy.get('[data-cy="user-view"]').contains(NEW_WEBSITE);
    cy.get('[data-cy="user-view"]').contains(NEW_USERNAME);
  });
});
