import data from '../../../../shared/testing/data';

const channel = data.channels.find(c => c.slug === 'private');
const community = data.communities.find(
  community => community.id === channel.communityId
);
const { userId: ownerInChannelId } = data.usersChannels.find(
  ({ channelId, isOwner }) => channelId === channel.id && isOwner
);

describe.skip('private channel invite link settings', () => {
  beforeEach(() => {
    cy.auth(ownerInChannelId);
    cy.visit(`/${community.slug}/${channel.slug}/settings`);
  });

  it('should enable private invite link', () => {
    cy.get('[data-cy="channel-overview"]').should('be.visible');

    cy.get('[data-cy="login-with-token-settings"]').scrollIntoView();

    cy
      .get('[data-cy="toggle-token-link-invites-unchecked"]')
      .should('be.visible')
      .click();

    cy.get('[data-cy="join-link-input"]').should('be.visible');
  });

  it('should refresh invite link token', () => {
    cy.get('[data-cy="channel-overview"]').should('be.visible');

    cy.get('[data-cy="login-with-token-settings"]').scrollIntoView();

    cy
      .get('[data-cy="join-link-input"]')
      .invoke('val')
      .then(val1 => {
        // do more work here

        // click the button which changes the input's value
        cy.get('[data-cy="refresh-join-link-token"]').should('be.visible');

        cy.get('[data-cy="refresh-join-link-token"]').click();

        cy.get('[data-cy="refresh-join-link-token"]').should('be.disabled');
        cy.get('[data-cy="refresh-join-link-token"]').should('not.be.disabled');

        // grab the input again and compare its previous value
        // to the current value
        cy
          .get('[data-cy="join-link-input"]')
          .invoke('val')
          .should(val2 => {
            expect(val1).not.to.eq(val2);
          });
      });
  });

  it('should disable private invite link', () => {
    cy.get('[data-cy="channel-overview"]').should('be.visible');

    cy.get('[data-cy="login-with-token-settings"]').scrollIntoView();

    cy
      .get('[data-cy="toggle-token-link-invites-checked"]')
      .should('be.visible')
      .click();

    cy.get('[data-cy="join-link-input"]').should('not.be.visible');
  });
});
