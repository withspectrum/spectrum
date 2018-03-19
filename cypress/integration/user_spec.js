import data from '../../shared/testing/data';

const user = data.users[0];

describe('User View', () => {
  before(() => {
    cy.visit(`/users/${user.username}`);
  });

  it('should render', () => {
    cy.get('[data-e2e-id="user-view"]').should('be.visible');
    cy.contains(user.username);
    cy.contains(user.name);
    cy.contains(user.description);
    cy.contains(user.website);
    cy.get('[data-e2e-id="thread-feed"]').should('be.visible');
    data.threads
      .filter(thread => thread.creatorId === user.id)
      .forEach(thread => {
        cy.contains(thread.content.title);
      });
  });

  it('should list the communities a user is a member of, including their rep in that community', () => {
    const usersCommunities = data.usersCommunities.filter(
      ({ userId }) => userId === user.id
    );
    const communityIds = usersCommunities.map(({ communityId }) => communityId);
    const communities = data.communities.filter(({ id }) =>
      communityIds.includes(id)
    );
    communities.forEach(community => {
      cy.contains(community.name);
      const userCommunity = usersCommunities.find(
        ({ communityId }) => communityId === community.id
      );
      cy.contains(userCommunity.reputation);
    });
  });
});
