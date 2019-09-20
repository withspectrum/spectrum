import data from '../../../shared/testing/data';
const user = data.users.find(u => !u.username);

const setUsernameIsVisible = () => {
  cy.get('[data-cy="new-user-onboarding"]').should('be.visible');
  cy.url().should('include', '/new/user');
};

const saveUsername = () => {
  cy.get('[data-cy="save-username-button"]')
    .should('be.visible')
    .click();
};

describe('brand new user', () => {
  beforeEach(() => {
    cy.auth(user.id).then(() => cy.visit('/'));
  });

  it('should redirect to /new/user', () => {
    setUsernameIsVisible();
  });

  it('should prevent viewing anything without a username', () => {
    setUsernameIsVisible();

    cy.get('[data-cy="navigation-explore"]')
      .should('be.visible')
      .click();
    setUsernameIsVisible();

    cy.get('[data-cy="navigation-messages"]')
      .should('be.visible')
      .click();
    setUsernameIsVisible();

    cy.get('[data-cy="navigation-notifications"]')
      .should('be.visible')
      .click();
    setUsernameIsVisible();

    cy.get('[data-cy="navigation-profile"]')
      .should('be.visible')
      .click();
    setUsernameIsVisible();

    cy.visit('/spectrum');
    setUsernameIsVisible();

    cy.visit('/spectrum/general');
    setUsernameIsVisible();

    cy.visit('/thread/thread-1');
    setUsernameIsVisible();

    cy.visit('/me');
    setUsernameIsVisible();

    cy.visit('/me/settings');
    setUsernameIsVisible();
  });

  it('should handle username collisions', () => {
    setUsernameIsVisible();
    cy.get('[data-cy="username-search"]')
      .should('be.visible')
      .clear();
    cy.get('[data-cy="username-search"]').type('mxstbr');
    cy.get('[data-cy="username-search-error"]').should('be.visible');
    cy.get('[data-cy="username-search"]')
      .clear()
      .type('new-user');
    cy.get('[data-cy="username-search-error"]').should('not.be.visible');
    cy.get('[data-cy="username-search-success"]').should('not.be.visible');
  });

  it('should allow the user to logout', () => {
    setUsernameIsVisible();
    cy.get('[data-cy="new-user-onboarding-logout"]').should('be.visible');
  });
});

describe('post username creation redirects', () => {
  beforeEach(() => {
    cy.auth(user.id).then(() => cy.visit('/'));
  });

  afterEach(() => {
    cy.visit('/');
  });

  it('should redirect to previously viewed page 1', () => {
    cy.visit('/spectrum');
    setUsernameIsVisible();
    saveUsername();
    cy.url().should('include', '/spectrum');
    cy.get('[data-cy="community-profile-card"]').should('be.visible');
  });

  it('should redirect to previously viewed page 2', () => {
    cy.visit('/spectrum/general');
    setUsernameIsVisible();
    saveUsername();
    cy.url().should('include', '/spectrum/general');
  });

  it('should redirect to previously viewed page 3', () => {
    cy.visit('/thread/thread-1');
    setUsernameIsVisible();
    saveUsername();
    cy.url().should('include', '/thread/thread-1');
    cy.get('[data-cy="community-profile-card"]').should('be.visible');
  });

  it('should redirect to previously viewed page 4', () => {
    cy.visit('/me');
    setUsernameIsVisible();
    saveUsername();
    cy.url().should('include', '/users/new-user');
    cy.get('[data-cy="user-view"]').should('be.visible');
  });

  it('should persist community join token', () => {
    cy.visit('/private-join/join/abc');
    setUsernameIsVisible();
    saveUsername();
    cy.url().should('include', '/private-join');
    cy.get('[data-cy="community-profile-card"]').should('be.visible');
  });

  it('should persist channel join token', () => {
    cy.visit('/payments/private/join/abc');
    setUsernameIsVisible();
    saveUsername();
    cy.url().should('include', '/payments/private');
  });

  it('should take user to explore if no previously viewed page', () => {
    setUsernameIsVisible();
    saveUsername();
    cy.get('[data-cy="explore-page"]').should('be.visible');
  });
});
