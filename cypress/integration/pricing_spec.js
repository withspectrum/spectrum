import data from '../../shared/testing/data';

const community = data.communities[0];
const { userId: ownerId } = data.usersCommunities.find(
  ({ communityId, isOwner }) => communityId === community.id && isOwner
);

describe('Renders pricing page features lists', () => {
  beforeEach(() => {
    cy.visit(`/pricing`);
  });

  it('should render key pricing page components', () => {
    cy.get('[data-cy="pricing-page"]').should('be.visible');
    cy
      .get('[data-cy="paid-features-list"]')
      .scrollIntoView()
      .should('be.visible');
    cy
      .get('[data-cy="free-features-list"]')
      .scrollIntoView()
      .should('be.visible');
  });
});

describe('Renders pricing page owned communities', () => {
  beforeEach(() => {
    cy.auth(ownerId);
    cy.visit(`/pricing`);
  });

  it('should render owned communities', () => {
    cy
      .get('[data-cy="owned-communities-list"]')
      .scrollIntoView()
      .should('be.visible');
  });
});
