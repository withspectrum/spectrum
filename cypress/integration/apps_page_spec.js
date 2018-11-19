describe('Privacy View', () => {
  describe('Loads page', () => {
    beforeEach(() => {
      cy.visit('/apps');
    });

    it('should render the privacy page', () => {
      cy.get('[data-cy="apps-page"]').should('be.visible');
    });
  });
});
