import data from '../../shared/testing/data';

const user = data.users[0];
const channelIds = data.usersChannels
  .filter(({ userId }) => userId === user.id)
  .map(({ channelId }) => channelId);
const dashboardThreads = data.threads.filter(({ channelId }) =>
  channelIds.includes(channelId)
);

describe('Inbox View', () => {
  before(() => {
    cy.auth(user.id);
    cy.visit('/');
  });

  it('should render the inbox view', () => {
    cy.get('[data-cy="inbox-view"]').should('be.visible');
    dashboardThreads.forEach(thread => {
      cy.contains(thread.content.title);
    });
    const usersCommunities = data.usersCommunities
      .filter(({ userId }) => user.id === userId)
      .map(({ communityId }) =>
        data.communities.find(({ id }) => id === communityId)
      );
    usersCommunities.forEach(community => {
      cy.contains(community.name);
    });
    cy.get('[data-cy="thread-view"]').should('be.visible');
  });
});
