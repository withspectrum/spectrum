import data from '../../../../shared/testing/data';
const channel = data.channels[0];
const community = data.communities.find(
  community => community.id === channel.communityId
);

describe('renders search on channel view', () => {
  before(() => {
    cy.visit(`/${community.slug}/${channel.slug}`);
  });

  it('should render search tab', () => {
    cy.get('[data-cy="channel-search-tab"]').should('be.visible');

    cy.get('[data-cy="channel-search-tab"]').click();

    cy.get('[data-cy="channel-search-input"]').should('be.visible');
  });
});
