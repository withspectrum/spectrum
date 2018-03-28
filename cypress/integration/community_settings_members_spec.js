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

describe('Community settings members tab', () => {
  beforeEach(() => {
    cy.auth(ownerId);
  });

  it('should have a list of the members', () => {
    cy.visit(`/${community.slug}/settings`);
    cy
      .get(`[href="/${community.slug}/settings/members"]`)
      .should('be.visible')
      .click();
    members.forEach(member => {
      cy.contains(member.name).should('be.visible');
    });
  });
});
