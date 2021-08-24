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

    cy.get('[href*="github.com/withspectrum/code-of-conduct"]').should(
      'be.visible'
    );
  });
});
