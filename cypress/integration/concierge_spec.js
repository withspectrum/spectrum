describe('Renders conceirge page ', () => {
  beforeEach(() => {
    cy.visit(`/pricing/conceirge`);
  });

  it('should render key conceirge page components', () => {
    cy.get('[data-cy="conceirge-page"]').should('be.visible');
  });
});
