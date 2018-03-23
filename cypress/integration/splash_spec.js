describe('Splash View', () => {
  before(() => {
    cy.visit('/');
  });

  it('should render the splash page', () => {
    cy.get('[data-cy="splash-page"]').should('be.visible');
    cy.get('[href*="/login"]').should('be.visible');
    cy.get('[href*="/new/community"]').should('be.visible');
  });
});
