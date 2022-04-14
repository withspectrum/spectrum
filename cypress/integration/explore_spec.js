describe('Login View', () => {
  beforeEach(() => {
    cy.visit('/explore');
  });

  it('should render', () => {
    cy.get('[data-cy="explore-page"]').should('be.visible');
    cy.get('[data-cy="explore-community-search-input"]').should('be.visible');
  });
});
