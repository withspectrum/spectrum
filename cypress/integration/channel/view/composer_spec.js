import data from '../../../../shared/testing/data';
import constants from '../../../../api/migrations/seed/default/constants';

const channel = data.channels[0];
const archivedChannel = data.channels.find(c => c.slug === 'archived');

const community = data.communities.find(
  community => community.id === channel.communityId
);

const { userId: memberInChannelId } = data.usersChannels.find(
  ({ channelId, isMember, isOwner }) => channelId === channel.id && isMember
);

const { userId: memberInArchivedChannelId } = data.usersChannels.find(
  ({ channelId, isMember, isOwner }) =>
    channelId === archivedChannel.id && isMember
);

const QUIET_USER_ID = constants.QUIET_USER_ID;

describe('renders composer for logged in members', () => {
  beforeEach(() => {
    cy.auth(memberInChannelId);
    cy.visit(`/${community.slug}/${channel.slug}`);
  });

  it('should render composer', () => {
    cy.get('[data-cy="channel-view"]').should('be.visible');

    cy.get('[data-cy="thread-composer-placeholder"]').should('be.visible');

    cy.get('[data-cy="thread-composer-placeholder"]').click();

    cy.get('[data-cy="thread-composer"]').should('be.visible');
  });
});

describe('does not render composer for non members', () => {
  beforeEach(() => {
    cy.auth(QUIET_USER_ID);
    cy.visit(`/${community.slug}/${channel.slug}`);
  });

  it('should not render composer', () => {
    cy.get('[data-cy="channel-view"]').should('be.visible');

    cy.get('[data-cy="thread-composer-placeholder"]').should('not.be.visible');
  });
});

describe('does not render composer for logged out users', () => {
  beforeEach(() => {
    cy.visit(`/${community.slug}/${channel.slug}`);
  });

  it('should not render composer', () => {
    cy.get('[data-cy="channel-view"]').should('be.visible');

    cy.get('[data-cy="thread-composer-placeholder"]').should('not.be.visible');
  });
});

describe('does not render composer for archived channel', () => {
  beforeEach(() => {
    cy.auth(memberInArchivedChannelId);
    cy.visit(`/${community.slug}/${archivedChannel.slug}`);
  });

  it('should not render composer', () => {
    cy.get('[data-cy="channel-view"]').should('be.visible');

    cy.get('[data-cy="thread-composer-placeholder"]').should('not.be.visible');
  });
});
