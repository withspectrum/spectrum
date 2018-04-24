describe('Privacy View', () => {
  describe('Loads page', () => {
    beforeEach(() => {
      cy.visit('/privacy');
    });

    it('should render the privacy page', () => {
      cy.get('[data-cy="privacy-page"]').should('be.visible');
    });
  });

  describe('Loads page', () => {
    beforeEach(() => {
      cy.visit('/privacy.html');
    });

    it('should render the privacy page', () => {
      cy.get('[data-cy="privacy-page"]').should('be.visible');
    });
  });
});
