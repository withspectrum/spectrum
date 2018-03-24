describe('Login View', () => {
  beforeEach(() => {
    cy.visit('/explore');
  });

  it('should render', () => {
    cy.get('[data-e2e-id="explore-page"]').should('be.visible');
    cy
      .get('[data-e2e-id="explore-community-search-input"]')
      .should('be.visible');
  });
});
