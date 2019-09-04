import data from '../../shared/testing/data';
const user = data.users[1];
const communities = data.communities;
const channels = data.channels;
const threads = data.threads;
const publicAuthoredThreads = threads.filter(thread => {
  const community = communities.find(
    community => community.id === thread.communityId
  );
  const channel = channels.find(channel => channel.id === thread.channelId);
  return (
    thread.creatorId === user.id && !community.isPrivate && !channel.isPrivate
  );
});

describe('User View', () => {
  it('should render', () => {
    cy.visit(`/users/${user.username}`);
    cy.get('[data-cy="user-view"]').should('be.visible');
    cy.contains(user.username);
    cy.contains(user.name);
    cy.contains(user.description);
    cy.contains(user.website);
    cy.get('[data-cy="thread-feed"]').should('be.visible');
    publicAuthoredThreads.forEach(thread => {
      cy.contains(thread.content.title);
    });
  });

  it('should list the public communities a user is a member of, including their rep in that community', () => {
    cy.visit(`/users/${user.username}`);
    cy.get('[data-cy="user-view"]').should('be.visible');
    const usersCommunities = data.usersCommunities.filter(
      ({ userId }) => userId === user.id
    );
    const communityIds = usersCommunities.map(({ communityId }) => communityId);
    const communities = data.communities.filter(
      ({ id, isPrivate }) => communityIds.includes(id) && isPrivate !== true
    );
    communities.forEach(community => {
      cy.contains(community.name);
    });
  });
});
