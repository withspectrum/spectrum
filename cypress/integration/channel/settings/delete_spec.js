import data from '../../../../shared/testing/data';

const channel = data.channels[0];
const privateChannel = data.channels[1];

const community = data.communities.find(
  community => community.id === channel.communityId
);

const privateCommunity = data.communities.find(
  community => community.id === privateChannel.communityId
);

const { userId: ownerInChannelId } = data.usersChannels.find(
  ({ channelId, isOwner }) => channelId === channel.id && isOwner
);

const { userId: ownerInPrivateChannelId } = data.usersChannels.find(
  ({ channelId, isOwner }) => channelId === privateChannel.id && isOwner
);

describe('deleting general channel', () => {
  beforeEach(() => {
    cy.auth(ownerInChannelId).then(() =>
      cy.visit(`/${community.slug}/${channel.slug}/settings`)
    );
  });

  it('should not allow general channel to be deleted', () => {
    cy.get('[data-cy="channel-overview"]').should('be.visible');

    cy.get('[data-cy="delete-channel-button"]').should('not.be.visible');
  });
});

describe('deleting a channel', () => {
  beforeEach(() => {
    cy.auth(ownerInPrivateChannelId).then(() =>
      cy.visit(`/${privateCommunity.slug}/${privateChannel.slug}/settings`)
    );
  });

  it('should delete a channel', () => {
    cy.get('[data-cy="channel-overview"]').should('be.visible');

    cy.get('[data-cy="delete-channel-button"]')
      .should('be.visible')
      .click();

    cy.get('[data-cy="delete-button"]').should('be.visible');
  });
});
