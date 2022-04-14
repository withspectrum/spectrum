import data from '../../../../shared/testing/data';

const community = data.communities.find(c => c.slug === 'private');
const { userId: ownerInCommunityId } = data.usersCommunities.find(
  ({ communityId, isOwner }) => communityId === community.id && isOwner
);

const enable = () => {
  cy.get('[data-cy="community-settings"]').should('be.visible');

  cy.get('[data-cy="login-with-token-settings"]').scrollIntoView();

  cy.get('[data-cy="toggle-token-link-invites-unchecked"]')
    .should('be.visible')
    .click();

  cy.get('[data-cy="join-link-input"]').should('be.visible');
};

describe('private community invite link settings', () => {
  beforeEach(() => {
    cy.auth(ownerInCommunityId).then(() =>
      cy.visit(`/${community.slug}/settings/members`)
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
          .scrollIntoView()
          .invoke('val')
          .should(val2 => {
            expect(val1).not.to.eq(val2);
          });
      });

    // disable
    cy.get('[data-cy="toggle-token-link-invites-checked"]')
      .scrollIntoView()
      .should('be.visible')
      .click();

    cy.get('[data-cy="join-link-input"]').should('not.be.visible');
  });
});
