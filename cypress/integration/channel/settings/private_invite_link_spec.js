import data from '../../../../shared/testing/data';

const channel = data.channels.find(c => c.slug === 'private');
const community = data.communities.find(
  community => community.id === channel.communityId
);
const { userId: ownerInChannelId } = data.usersChannels.find(
  ({ channelId, isOwner }) => channelId === channel.id && isOwner
);

const enable = () => {
  cy.get('[data-cy="channel-overview"]').should('be.visible');

  cy.get('[data-cy="login-with-token-settings"]').scrollIntoView();

  cy.get('[data-cy="toggle-token-link-invites-unchecked"]').click();

  cy.get('[data-cy="join-link-input"]').should('be.visible');
};

describe('private channel invite link settings', () => {
  beforeEach(() => {
    cy.auth(ownerInChannelId).then(() =>
      cy.visit(`/${community.slug}/${channel.slug}/settings`)
    );
  });

  it('should handle enable, reset, and disable', () => {
    // enable
    enable();

    // reset token
    cy.get('[data-cy="login-with-token-settings"]').scrollIntoView();
    cy.get('[data-cy="join-link-input"]')
      .invoke('val')
      .then(val1 => {
        // do more work here

        // click the button which changes the input's value
        cy.get('[data-cy="refresh-join-link-token"]').should('be.visible');

        cy.get('[data-cy="refresh-join-link-token"]').click();

        // grab the input again and compare its previous value
        // to the current value
        cy.get('[data-cy="join-link-input"]')
          .invoke('val')
          .should('not.eq', val1);
      });

    // disable
    cy.get('[data-cy="toggle-token-link-invites-checked"]').click();

    cy.get('[data-cy="join-link-input"]').should('not.be.visible');
  });
});
