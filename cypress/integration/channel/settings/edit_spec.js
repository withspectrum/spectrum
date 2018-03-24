// @flow
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
  before(() => {
    cy.auth(ownerInChannelId);
    cy.visit(`/${community.slug}/${channel.slug}`);
  });

  it('should edit a channel', () => {
    cy
      .get('[data-cy="channel-settings-button"]')
      .should('be.visible')
      .click();

    cy.get('[data-cy="channel-overview"]').should('be.visible');

    cy
      .get('[data-cy="channel-name-input"]')
      .should('be.visible')
      .click()
      .clear()
      .type(NEW_NAME);

    cy
      .get('[data-cy="channel-description-input"]')
      .should('be.visible')
      .click()
      .clear()
      .type(NEW_DESCRIPTION);

    cy
      .get('[data-cy="save-button"]')
      .should('be.visible')
      .click();

    cy.get('[data-cy="save-button"]').should('be.disabled');

    cy.get('[data-cy="save-button"]').should('not.be.disabled');

    cy.visit(`/${community.slug}/${channel.slug}`);
    cy.get('[data-cy="channel-profile-full"]').should('be.visible');
    cy.get('[data-cy="channel-profile-full"]').contains(NEW_NAME);
    cy.get('[data-cy="channel-profile-full"]').contains(NEW_DESCRIPTION);
  });
});
