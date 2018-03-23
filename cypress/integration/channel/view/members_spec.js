// @flow
import data from '../../../../shared/testing/data';
const channel = data.channels[0];
const community = data.communities.find(
  community => community.id === channel.communityId
);
const usersChannels = data.usersChannels
  .filter(({ channelId, isMember }) => channelId === channel.id && isMember)
  .map(o => o.userId);
const members = data.users.filter(user => usersChannels.indexOf(user.id) >= 0);

describe('renders members list on channel view', () => {
  before(() => {
    cy.visit(`/${community.slug}/${channel.slug}`);
  });

  it('should render members component', () => {
    cy.get('[data-cy="channel-members-list"]').should('be.visible');

    members.map(member => {
      cy
        .get('[data-cy="channel-view"]')
        .contains(`${member.name}`)
        .should('be.visible');
    });
  });
});
