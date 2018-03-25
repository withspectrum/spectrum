describe('Home View', () => {
  before(() => {
    cy.visit('/');
  });

  it('should render the home page', () => {
    cy.get('[data-e2e-id="home-page"]').should('be.visible');
    cy.get('[href*="/login"]').should('be.visible');
    cy.get('[href*="/new/community"]').should('be.visible');
  });
});
