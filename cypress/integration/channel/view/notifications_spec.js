import data from '../../../../shared/testing/data';
import constants from '../../../../iris/migrations/seed/default/constants';

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
  before(() => {
    cy.visit(`/${community.slug}/${channel.slug}`);
  });

  it('should not render notifications settings', () => {
    cy.get('[data-cy="channel-view"]').should('be.visible');

    cy.get('[data-cy="notifications-checkbox"]').should('not.be.visible');
  });
});

describe('channel notification preferences as member', () => {
  before(() => {
    cy.auth(memberInChannelId);
    cy.visit(`/${community.slug}/${channel.slug}`);
  });

  it('should render notification settings', () => {
    cy.get('[data-cy="channel-view"]').should('be.visible');

    cy
      .get('[data-cy="notifications-checkbox-checked"]')
      .should('be.visible')
      .click();

    cy
      .get('[data-cy="notifications-checkbox-unchecked"]')
      .should('be.visible')
      .click();
  });
});

describe('channel profile as non-member', () => {
  before(() => {
    cy.auth(QUIET_USER_ID);
    cy.visit(`/${community.slug}/${channel.slug}`);
  });

  it('should not render notifications settings', () => {
    cy.get('[data-cy="channel-view"]').should('be.visible');

    cy
      .get('[data-cy="notifications-checkbox-checked"]')
      .should('not.be.visible');
  });
});
