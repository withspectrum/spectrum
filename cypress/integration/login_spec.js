describe('Sign up', () => {
  beforeEach(() => {
    cy.visit('/new/user');
  });

  it('should only allow github signup', () => {
    cy.get('[data-cy="login-page"]').should('be.visible');
    cy.get('[href*="/auth/github"]').should('be.visible');
    cy.get('[href*="/login"]').should('be.visible');
    cy.get('[href*="github.com/withspectrum/code-of-conduct"]').should(
      'be.visible'
    );
  });
});

describe('Log in', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should render login methods', () => {
    cy.get('[data-cy="login-page"]').should('be.visible');
    cy.get('[href*="/auth/twitter"]').should('be.visible');
    cy.get('[href*="/auth/facebook"]').should('be.visible');
    cy.get('[href*="/auth/google"]').should('be.visible');
    cy.get('[href*="/auth/github"]').should('be.visible');
    cy.get('[href*="/new/user"]').should('be.visible');

    cy.get('[href*="github.com/withspectrum/code-of-conduct"]').should(
      'be.visible'
    );
  });
});

describe('Community Signup View', () => {
  beforeEach(() => {
    cy.visit('/spectrum/login');
  });

  it('should render', () => {
    cy.get('[data-cy="community-login-page"]').should('be.visible');
    cy.get('[href*="/auth/github?r=http://localhost:3000/spectrum"]').should(
      'be.visible'
    );
    cy.get('[href*="github.com/withspectrum/code-of-conduct"]').should(
      'be.visible'
    );

    cy.get('[href*="/login?r=http://localhost:3000/spectrum"]').should(
      'be.visible'
    );
  });
});

describe('Redirect paths', () => {
  it('should preserve community redirect paths', () => {
    cy.visit('/spectrum/login');
    cy.get('[data-cy="community-login-page"]').should('be.visible');
    cy.get('[href*="/auth/github?r=http://localhost:3000/spectrum"]').should(
      'be.visible'
    );
    cy.get('[href*="github.com/withspectrum/code-of-conduct"]').should(
      'be.visible'
    );

    cy.get('[href*="/login?r=http://localhost:3000/spectrum"]')
      .should('be.visible')
      .click();

    cy.get('[href*="/auth/twitter?r=http://localhost:3000/spectrum"]').should(
      'be.visible'
    );
    cy.get('[href*="/auth/facebook?r=http://localhost:3000/spectrum"]').should(
      'be.visible'
    );
    cy.get('[href*="/auth/google?r=http://localhost:3000/spectrum"]').should(
      'be.visible'
    );
    cy.get('[href*="/auth/github?r=http://localhost:3000/spectrum"]').should(
      'be.visible'
    );
    cy.get('[href*="/new/user?r=http://localhost:3000/spectrum"]').should(
      'be.visible'
    );
  });

  it('should preserve thread redirect paths', () => {
    const path =
      'http://localhost:3000/spectrum/general/yet-another-thread~thread-3';
    cy.visit(path);
    cy.get('[data-cy="join-community-chat-upsell"]')
      .should('be.visible')
      .click();

    cy.get('[data-cy="login-modal"]').should('be.visible');
    cy.get(`[href*="/auth/github?r=${path}"]`).should('be.visible');
    cy.get('[href*="github.com/withspectrum/code-of-conduct"]').should(
      'be.visible'
    );

    cy.get(`[href*="/login?r=${path}"]`)
      .should('be.visible')
      .click();

    cy.get(`[href*="/auth/twitter?r=${path}"]`).should('be.visible');
    cy.get(`[href*="/auth/facebook?r=${path}"]`).should('be.visible');
    cy.get(`[href*="/auth/google?r=${path}"]`).should('be.visible');
    cy.get(`[href*="/auth/github?r=${path}"]`).should('be.visible');
    cy.get(`[href*="/new/user?r=${path}"]`).should('be.visible');
  });
});
