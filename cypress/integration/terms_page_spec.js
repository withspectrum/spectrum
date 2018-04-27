describe('Terms View', () => {
  describe('Loads page', () => {
    beforeEach(() => {
      cy.visit('/terms');
    });

    it('should render the terms page', () => {
      cy.get('[data-cy="terms-page"]').should('be.visible');
    });
  });

  describe('Loads page', () => {
    beforeEach(() => {
      cy.visit('/terms.html');
    });

    it('should render the terms page', () => {
      cy.get('[data-cy="terms-page"]').should('be.visible');
    });
  });
});
