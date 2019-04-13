describe('Login View', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should render', () => {
    cy.get('[data-cy="login-page"]').should('be.visible');
    cy.get('[href*="/auth/twitter"]').should('be.visible');
    cy.get('[href*="/auth/facebook"]').should('be.visible');
    cy.get('[href*="/auth/google"]').should('be.visible');
    cy.get('[href*="/auth/github"]').should('be.visible');
    cy.get('[href*="github.com/withspectrum/code-of-conduct"]').should(
      'be.visible'
    );
  });
});

describe('Community Login View', () => {
  beforeEach(() => {
    cy.visit('/spectrum/login');
  });

  it('should render', () => {
    cy.get('[data-cy="community-login-page"]').should('be.visible');
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
    cy.get('[href*="github.com/withspectrum/code-of-conduct"]').should(
      'be.visible'
    );
  });
});
