import data from '../../shared/testing/data';

const community = data.communities[0];
const members = data.usersCommunities
  .filter(
    ({ communityId, isMember }) => community.id === communityId && isMember
  )
  .map(({ userId }) => data.users.find(({ id }) => id === userId));
const { userId: ownerId } = data.usersCommunities.find(
  ({ communityId, isOwner }) => communityId === community.id && isOwner
);
const channels = data.channels.filter(
  ({ communityId }) => community.id === communityId
);

describe('Pricing View', () => {
  describe('Loads page', () => {
    beforeEach(() => {
      cy.visit(`/pricing`);
    });

    it('should render key pricing page components', () => {
      cy.get('[data-e2e-id="pricing-page"]').should('be.visible');
      cy.get('[data-e2e-id="pricing-page-price-table"]').should('be.visible');
      cy
        .get('[data-e2e-id="pricing-page-paid-features-list"]')
        .should('be.visible');
      cy
        .get('[data-e2e-id="pricing-page-free-features-list"]')
        .should('be.visible');
    });
  });

  describe('Loads owned communities', () => {
    beforeEach(() => {
      cy.auth(ownerId);
    });

    it('should render owned communities', () => {
      cy.visit(`/pricing`);
      cy
        .get('[data-e2e-id="pricing-page-owned-communities-list"]')
        .should('be.visible');
    });
  });
});
