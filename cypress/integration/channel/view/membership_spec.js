import data from '../../../../shared/testing/data';
import constants from '../../../../iris/migrations/seed/default/constants';

const publicChannel = data.channels[0];
const privateChannel = data.channels[1];

const community = data.communities.find(
  community => community.id === publicChannel.communityId
);

const { userId: blockedInChannelId } = data.usersChannels.find(
  ({ channelId, isBlocked }) => channelId === publicChannel.id && isBlocked
);

const { userId: ownerInChannelId } = data.usersChannels.find(
  ({ channelId, isOwner }) => channelId === publicChannel.id && isOwner
);

const { userId: memberInChannelId } = data.usersChannels.find(
  ({ channelId, isMember, isOwner }) =>
    channelId === publicChannel.id && isMember && !isOwner
);

const { userId: memberInPrivateChannelId } = data.usersChannels.find(
  ({ channelId, isMember }) => channelId === privateChannel.id && isMember
);

const QUIET_USER_ID = constants.QUIET_USER_ID;

describe('logged out channel membership', () => {
  before(() => {
    cy.visit(`/${community.slug}/${publicChannel.slug}`);
  });

  it('should render join button that links to login view', () => {
    cy.get('[data-cy="channel-login-join-button"]').should('be.visible');
  });
});

describe('channel profile as member', () => {
  before(() => {
    cy.auth(memberInChannelId);
    cy.visit(`/${community.slug}/${publicChannel.slug}`);
  });

  it('should render leave channel button', () => {
    cy
      .get('[data-cy="channel-join-button"]')
      .should('be.visible')
      .contains('Joined');

    cy
      .get('[data-cy="channel-join-button"]')
      .click()
      .contains(`Join `);

    cy
      .get('[data-cy="channel-join-button"]')
      .click()
      .contains(`Joined`);
  });
});

describe('channel profile as non-member', () => {
  before(() => {
    cy.auth(QUIET_USER_ID);
    cy.visit(`/${community.slug}/${publicChannel.slug}`);
  });

  it('should render join channel button', () => {
    cy
      .get('[data-cy="channel-join-button"]')
      .should('be.visible')
      .contains(`Join `);

    cy
      .get('[data-cy="channel-join-button"]')
      .click()
      .contains(`Joined`);

    cy
      .get('[data-cy="channel-join-button"]')
      .click()
      .contains(`Join `);
  });
});

describe('channel profile as owner', () => {
  before(() => {
    cy.auth(ownerInChannelId);
    cy.visit(`/${community.slug}/${publicChannel.slug}`);
  });

  it('should render settings button', () => {
    cy
      .get('[data-cy="channel-settings-button"]')
      .should('be.visible')
      .contains('Settings');
  });
});

describe('private channel profile', () => {
  describe('private channel as member', () => {
    before(() => {
      cy.auth(memberInPrivateChannelId);
      cy.visit(`/${community.slug}/${privateChannel.slug}`);
    });

    it('should render profile', () => {
      cy.get('[data-cy="channel-view"]').should('be.visible');
    });
  });

  describe('private channel as non-member', () => {
    before(() => {
      cy.auth(QUIET_USER_ID);
      cy.visit(`/${community.slug}/${privateChannel.slug}`);
    });

    it('should render request to join view', () => {
      cy.get('[data-cy="channel-view-is-restricted"]').should('be.visible');

      cy
        .get('[data-cy="request-to-join-private-channel-button"]')
        .contains(`Request to join ${privateChannel.name}`)
        .click();

      cy
        .get('[data-cy="cancel-request-to-join-private-channel-button"]')
        .contains('Cancel request')
        .click();
    });
  });
});
