import data from '../../../../shared/testing/data';

const channel = data.channels[0];

const community = data.communities.find(
  community => community.id === channel.communityId
);

const { userId: ownerInChannelId } = data.usersChannels.find(
  ({ channelId, isOwner }) => channelId === channel.id && isOwner
);

// NOTE @brian: I will finish this after payments-api-v2 merges

describe('create a channel', () => {
  beforeEach(() => {
    cy.auth(ownerInChannelId);
    // NOTE @brian: I can not get this to auth directly into /settings, having to work around for now
    cy.visit(`/${community.slug}/settings`);
  });

  it('should go through create a channel flow', () => {
    cy
      .get('[data-cy="create-channel-button"]')
      .scrollIntoView()
      .should('be.visible')
      .click();
  });
});
