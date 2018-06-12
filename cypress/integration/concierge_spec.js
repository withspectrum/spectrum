describe('Renders conceirge page ', () => {
  beforeEach(() => {
    cy.visit(`/pricing/concierge`);
  });

  it('should render key conceirge page components', () => {
    cy.get('[data-cy="concierge-page"]').should('be.visible');
  });
});
