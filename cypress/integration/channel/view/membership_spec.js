import data from '../../../../shared/testing/data';
import constants from '../../../../api/migrations/seed/default/constants';

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

const leave = () => {
  cy
    .get('[data-cy="channel-join-button"]')
    .should('be.visible')
    .contains('Joined');

  cy.get('[data-cy="channel-join-button"]').click();

  cy.get('[data-cy="channel-join-button"]').contains(`Join `);
};

const join = () => {
  cy
    .get('[data-cy="channel-join-button"]')
    .should('be.visible')
    .contains('Join ');

  cy.get('[data-cy="channel-join-button"]').click();

  cy.get('[data-cy="channel-join-button"]').contains(`Joined`);
};

describe('logged out channel membership', () => {
  beforeEach(() => {
    cy.visit(`/${community.slug}/${publicChannel.slug}`);
  });

  it('should render join button that links to login view', () => {
    cy.get('[data-cy="channel-login-join-button"]').should('be.visible');
  });
});

describe('channel profile as member', () => {
  beforeEach(() => {
    cy.auth(memberInChannelId);
    cy.visit(`/${community.slug}/${publicChannel.slug}`);
  });

  it('should render leave channel button', () => {
    leave();
    join();
  });
});

describe('channel profile as non-member', () => {
  beforeEach(() => {
    cy.auth(QUIET_USER_ID);
    cy.visit(`/${community.slug}/${publicChannel.slug}`);
  });

  it('should render join channel button', () => {
    join();
    leave();
  });
});

describe('channel profile as owner', () => {
  beforeEach(() => {
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
    beforeEach(() => {
      cy.auth(memberInPrivateChannelId);
      cy.visit(`/${community.slug}/${privateChannel.slug}`);
    });

    it('should render profile', () => {
      cy.get('[data-cy="channel-view"]').should('be.visible');
    });
  });

  describe('private channel as non-member', () => {
    beforeEach(() => {
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
