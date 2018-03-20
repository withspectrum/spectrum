import data from '../../shared/testing/data';

const channel = data.channels[0];
const community = data.communities.find(
  community => community.id === channel.communityId
);

describe('Channel View', () => {
  // Before every test suite set up a new browser and page
  before(() => {
    cy.visit(`/${community.slug}/${channel.slug}`);
  });

  it('should render', () => {
    cy.get('[data-e2e-id="channel-view"]').should('be.visible');
    cy.contains(channel.description);
    cy.contains(channel.name);
    data.threads
      .filter(thread => thread.channelId === channel.id)
      .forEach(thread => {
        cy.contains(thread.content.title);
      });
  });
});
