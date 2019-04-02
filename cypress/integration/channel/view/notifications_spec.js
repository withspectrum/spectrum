import data from '../../../../shared/testing/data';
import constants from '../../../../api/migrations/seed/default/constants';

const channel = data.channels[0];
const community = data.communities.find(
  community => community.id === channel.communityId
);
const { userId: memberInChannelId } = data.usersChannels.find(
  ({ channelId, isMember, isOwner }) =>
    channelId === channel.id && isMember && !isOwner
);
const QUIET_USER_ID = constants.QUIET_USER_ID;

describe('channel notification preferences logged out', () => {
  beforeEach(() => {
    cy.visit(`/${community.slug}/${channel.slug}`);
  });

  it('should not render notifications settings', () => {
    cy.get('[data-cy="channel-view"]').should('be.visible');

    cy.get('[data-cy="channel-notifications-muted"]').should('not.be.visible');
    cy.get('[data-cy="channel-notifications-enabled"]').should(
      'not.be.visible'
    );
  });
});

describe('channel notification preferences as member', () => {
  beforeEach(() => {
    cy.auth(memberInChannelId).then(() =>
      cy.visit(`/${community.slug}/${channel.slug}`)
    );
  });

  it('should render notification settings', () => {
    cy.get('[data-cy="channel-view"]').should('be.visible');

    cy.get('[data-cy="channel-notifications-enabled"]').should($p => {
      expect($p).to.have.length(2);
    });

    cy.get('[data-cy="channel-notifications-enabled"]')
      .first()
      .click();

    cy.get('[data-cy="channel-notifications-enabled"]').should($p => {
      expect($p).to.have.length(1);
    });

    cy.get('[data-cy="channel-notifications-muted"]').should($p => {
      expect($p).to.have.length(1);
    });
  });
});

describe('channel profile as non-member', () => {
  beforeEach(() => {
    cy.auth(QUIET_USER_ID).then(() =>
      cy.visit(`/${community.slug}/${channel.slug}`)
    );
  });

  it('should not render notifications settings', () => {
    cy.get('[data-cy="channel-view"]').should('be.visible');

    cy.get('[data-cy="channel-notifications-muted"]').should('not.be.visible');
    cy.get('[data-cy="channel-notifications-enabled"]').should(
      'not.be.visible'
    );
  });
});
