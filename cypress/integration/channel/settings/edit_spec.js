import data from '../../../../shared/testing/data';

const channel = data.channels[0];

const community = data.communities.find(
  community => community.id === channel.communityId
);

const { userId: ownerInChannelId } = data.usersChannels.find(
  ({ channelId, isOwner }) => channelId === channel.id && isOwner
);

const NEW_NAME = 'General Update';
const NEW_DESCRIPTION = 'New description';

describe('edit a channel', () => {
  beforeEach(() => {
    cy.auth(ownerInChannelId).then(() =>
      cy.visit(`/${community.slug}/${channel.slug}/settings`)
    );
  });

  it('should edit a channel', () => {
    cy.get('[data-cy="channel-overview"]').should('be.visible');
    cy.get('[data-cy="channel-members"]').should('be.visible');
    cy.get('[data-cy="channel-name-input"]')
      .should('be.visible')
      .click()
      .clear()
      .type(NEW_NAME);

    cy.get('[data-cy="channel-description-input"]')
      .should('be.visible')
      .click()
      .clear()
      .type(NEW_DESCRIPTION);

    cy.get('[data-cy="save-button"]')
      .should('be.visible')
      .click();

    cy.visit(`/${community.slug}/${channel.slug}`);
    cy.contains(NEW_NAME);
  });
});
