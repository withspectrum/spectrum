describe('Apps View', () => {
  describe('Loads page', () => {
    beforeEach(() => {
      cy.visit('/apps');
    });

    it('should render the apps page', () => {
      cy.get('[data-cy="apps-page"]').should('be.visible');
    });
  });
});
