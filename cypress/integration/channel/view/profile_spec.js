import data from '../../../../shared/testing/data';

const publicChannel = data.channels[0];
const privateChannel = data.channels[1];
const archivedChannel = data.channels.find(c => c.slug === 'archived');
const deletedChannel = data.channels.find(c => c.slug === 'deleted');

const community = data.communities.find(
  community => community.id === publicChannel.communityId
);

const { userId: blockedInChannelId } = data.usersChannels.find(
  ({ channelId, isBlocked }) => channelId === publicChannel.id && isBlocked
);

const { userId: memberInPrivateChannelId } = data.usersChannels.find(
  ({ channelId, isMember }) => channelId === privateChannel.id && isMember
);

describe('public channel', () => {
  before(() => {
    cy.visit(`/${community.slug}/${publicChannel.slug}`);
  });

  it('should render profile', () => {
    cy.get('[data-cy="channel-view"]').should('be.visible');
  });

  it('should contain channel metadata', () => {
    cy.get('[data-cy="channel-profile-full"]').should('be.visible');
    cy.contains(community.name);
    cy.contains(publicChannel.description);
    cy.contains(publicChannel.name);
  });
});

describe('archived channel', () => {
  before(() => {
    cy.visit(`/${community.slug}/${archivedChannel.slug}`);
  });

  it('should render profile', () => {
    cy.get('[data-cy="channel-view"]').should('be.visible');
  });

  it('should contain archived tag', () => {
    cy.get('[data-cy="channel-profile-full"]').should('be.visible');
    cy.contains('(Archived)');
  });
});

describe('deleted channel', () => {
  before(() => {
    cy.visit(`/${community.slug}/${deletedChannel.slug}`);
  });

  it('should render error view', () => {
    cy.get('[data-cy="channel-not-found"]').should('be.visible');
    cy.contains('We couldn’t find a channel with this name');
  });
});

describe('blocked in public channel', () => {
  before(() => {
    cy.auth(blockedInChannelId);
    cy.visit(`/${community.slug}/${publicChannel.slug}`);
  });

  it('should render error view', () => {
    cy.get('[data-cy="channel-view-blocked"]').should('be.visible');
    cy.contains('You don’t have permission to view this channel');
  });
});

describe('member in private channel', () => {
  before(() => {
    cy.auth(memberInPrivateChannelId);
    cy.visit(`/${community.slug}/${privateChannel.slug}`);
  });

  it('should render profile', () => {
    cy.get('[data-cy="channel-view"]').should('be.visible');
  });
});

describe('blocked in private channel', () => {
  before(() => {
    cy.auth(blockedInChannelId);
    cy.visit(`/${community.slug}/${privateChannel.slug}`);
  });

  it('should render error view', () => {
    cy.get('[data-cy="channel-view-blocked"]').should('be.visible');
  });
});

describe('is not logged in', () => {
  before(() => {
    cy.visit(`/${community.slug}/${privateChannel.slug}`);
  });

  it('should render login view', () => {
    cy.contains(`Sign in`);
  });
});
