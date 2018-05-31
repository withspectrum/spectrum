describe('FAQ View', () => {
  describe('Loads page', () => {
    beforeEach(() => {
      cy.visit('/faq');
    });

    it('should render the faq page', () => {
      cy.get('[data-cy="faq-page"]').should('be.visible');
      cy.contains('Frequently Asked Questions').should('be.visible');
    });
  });
});
