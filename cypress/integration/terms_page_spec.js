describe('Terms View', () => {
  describe('Loads page', () => {
    before(() => {
      cy.visit('/terms');
    });

    it('should render the terms page', () => {
      cy.get('[data-e2e-id="terms-page"]').should('be.visible');
    });
  });

  describe('Loads page', () => {
    before(() => {
      cy.visit('/terms.html');
    });

    it('should render the terms page', () => {
      cy.get('[data-e2e-id="terms-page"]').should('be.visible');
    });
  });
});
