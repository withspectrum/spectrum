describe('Login View', () => {
  beforeEach(() => {
    cy.visit('/explore');
  });

  it('should render', () => {
    cy.get('[data-cy="explore-page"]').should('be.visible');
  });
});
