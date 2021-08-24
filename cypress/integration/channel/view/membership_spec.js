import data from '../../../../shared/testing/data';
import constants from '../../../../api/migrations/seed/default/constants';

const publicChannel = data.channels[0];
const privateChannel = data.channels[1];

const community = data.communities.find(
  community => community.id === publicChannel.communityId
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
  beforeEach(() => {
    cy.visit(`/${community.slug}/${publicChannel.slug}`);
  });

  it('should render profile', () => {
    cy.get('[data-cy="channel-view"]').should('be.visible');
  });
});

describe('channel profile as member', () => {
  beforeEach(() => {
    cy.auth(memberInChannelId).then(() =>
      cy.visit(`/${community.slug}/${publicChannel.slug}`)
    );
  });

  it('should render profile', () => {
    cy.get('[data-cy="channel-view"]').should('be.visible');
  });
});

describe('channel profile as non-member', () => {
  beforeEach(() => {
    cy.auth(QUIET_USER_ID).then(() =>
      cy.visit(`/${community.slug}/${publicChannel.slug}`)
    );
  });

  it('should render profile', () => {
    cy.get('[data-cy="channel-view"]').should('be.visible');
  });
});

describe('private channel profile', () => {
  describe('private channel as member', () => {
    beforeEach(() => {
      cy.auth(memberInPrivateChannelId).then(() =>
        cy.visit(`/${community.slug}/${privateChannel.slug}`)
      );
    });

    it('should render profile', () => {
      cy.get('[data-cy="channel-view"]').should('be.visible');
    });
  });

  describe('private channel as non-member', () => {
    beforeEach(() => {
      cy.auth(QUIET_USER_ID).then(() =>
        cy.visit(`/${community.slug}/${privateChannel.slug}`)
      );
    });

    it('should render channel not found view', () => {
      cy.get('[data-cy="channel-view-error"]').should('be.visible');
    });
  });
});
