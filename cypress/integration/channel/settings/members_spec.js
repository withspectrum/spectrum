import data from '../../../../shared/testing/data';

const channel = data.channels[0];
const community = data.communities.find(
  community => community.id === channel.communityId
);

const { userId: ownerInChannelId } = data.usersChannels.find(
  ({ channelId, isOwner }) => channelId === channel.id && isOwner
);

const membersChannels = data.usersChannels.filter(
  uc => uc.channelId === channel.id
);
const members = membersChannels
  .filter(mc => mc.isMember)
  .map(mc => data.users.find(user => mc.userId === user.id));
const member = members[0];

describe('sending a message to channel member', () => {
  beforeEach(() => {
    cy.auth(ownerInChannelId).then(() =>
      cy.visit(`/${community.slug}/${channel.slug}/settings`)
    );
  });

  it('should render all members', () => {
    cy.get('[data-cy="channel-overview"]').should('be.visible');

    members.map(member => {
      cy.contains(member.name)
        .scrollIntoView()
        .should('be.visible');
    });
  });
});
