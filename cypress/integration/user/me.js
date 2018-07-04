import data from '../../../shared/testing/data';
const user = data.users[0];

describe('can view current user settings at /me/settings', () => {
  beforeEach(() => {
    cy.auth(user.id);
    cy.visit(`/me`);
  });

  it('should render settings', () => {
    cy.get('[data-cy="user-view"]').should('be.visible');
    cy.contains(user.username);
    cy.contains(user.name);
    cy.contains(user.description);
  });
});

describe('can view current user settings at /me/settings', () => {
  beforeEach(() => {
    cy.auth(user.id);
    cy.visit(`/me/settings`);
  });

  it('should render settings', () => {
    cy.get('[data-cy="user-settings"]').should('be.visible');
  });
});

describe('loads login view at /me if no current user', () => {
  beforeEach(() => {
    cy.visit(`/me`);
  });

  it('should render login', () => {
    cy.get('[data-cy="login-page"]').should('be.visible');
  });
});
