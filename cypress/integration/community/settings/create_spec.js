import data from '../../../../shared/testing/data';

const user = data.users[0];

describe('creating a public community', () => {
  beforeEach(() => {
    cy.auth(user.id).then(() => cy.visit(`/new/community`));
  });

  it('should create a public community', () => {
    cy.get('[data-cy="create-community-form"]')
      .scrollIntoView()
      .should('be.visible');

    cy.get('[data-cy="community-name-input"]')
      .scrollIntoView()
      .should('be.visible')
      .click()
      .type('my public community');

    cy.get('[data-cy="community-description-input"]')
      .scrollIntoView()
      .should('be.visible')
      .click()
      .type('my public description');

    cy.get('[data-cy="community-website-input"]')
      .scrollIntoView()
      .should('be.visible')
      .click()
      .type('spectrum.chat');

    cy.get('[data-cy="community-website-input"]')
      .scrollIntoView()
      .should('be.visible')
      .click()
      .type('spectrum.chat');

    cy.get('[data-cy="community-public-selector-input"]')
      .scrollIntoView()
      .should('be.visible')
      .should('be.checked');

    cy.get('[data-cy="community-coc-input-unchecked"]')
      .scrollIntoView()
      .should('be.visible')
      .click();

    cy.get('[data-cy="community-create-button"]')
      .scrollIntoView()
      .should('be.visible')
      .should('not.be.disabled')
      .click();

    cy.get('[data-cy="community-creation-invitation-step"]').should(
      'be.visible'
    );
  });
});

describe('creating a private community', () => {
  beforeEach(() => {
    cy.auth(user.id).then(() => cy.visit(`/new/community`));
  });

  it('should create a private community', () => {
    cy.get('[data-cy="create-community-form"]')
      .scrollIntoView()
      .should('be.visible');

    cy.get('[data-cy="community-name-input"]')
      .scrollIntoView()
      .should('be.visible')
      .click()
      .type('private community');

    cy.get('[data-cy="community-description-input"]')
      .scrollIntoView()
      .should('be.visible')
      .click()
      .type('my private description');

    cy.get('[data-cy="community-website-input"]')
      .scrollIntoView()
      .should('be.visible')
      .click()
      .type('spectrum.chat');

    cy.get('[data-cy="community-website-input"]')
      .scrollIntoView()
      .should('be.visible')
      .click()
      .type('spectrum.chat');

    cy.get('[data-cy="community-public-selector-input"]')
      .scrollIntoView()
      .should('be.visible')
      .should('be.checked');

    cy.get('[data-cy="community-private-selector-input"]')
      .should('be.visible')
      .should('not.be.checked')
      .click();

    cy.get('[data-cy="community-private-selector-input"]').should('be.checked');

    cy.get('[data-cy="community-public-selector-input"]').should(
      'not.be.checked'
    );

    cy.get('[data-cy="community-coc-input-unchecked"]')
      .scrollIntoView()
      .should('be.visible')
      .click();

    cy.get('[data-cy="community-create-button"]')
      .scrollIntoView()
      .should('be.visible')
      .should('not.be.disabled')
      .click();

    cy.get('[data-cy="community-creation-invitation-step"]').should(
      'be.visible'
    );
  });
});
