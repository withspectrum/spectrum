import data from '../../shared/testing/data';

const community = data.communities[0];
const { userId: ownerId } = data.usersCommunities.find(
  ({ communityId, isOwner }) => communityId === community.id && isOwner
);
const channels = data.channels
  .filter(({ communityId }) => community.id === communityId)
  .filter(c => !c.deletedAt);

describe('Community settings overview tab', () => {
  beforeEach(() => {
    cy.auth(ownerId).then(() => cy.visit(`/${community.slug}/settings`));
  });

  it('should render the settings overview and allow editing the community metadata', () => {
    cy.get('[data-cy="community-settings"]').should('be.visible');
    cy.contains('Channels');
    // Make sure all channels are listed and link to their settings
    channels.forEach(channel => {
      cy.contains(channel.name);
      cy.get(`[href*="${community.slug}/${channel.slug}/settings"]`);
    });
    // Make sure the subnav is rendered correctly
    cy.get(`[href*="settings/analytics"]`).should('be.visible');
    cy.get(`[href*="settings/members"]`).should('be.visible');

    // Editing
    const name = 'text';
    const description = 'text';
    // Change name
    cy.get('[data-cy="community-settings-name-input"]')
      .clear()
      .type(`${name}`);
    // Change description
    cy.get('[data-cy="community-settings-description-input"]')
      .clear()
      .type(description);
    const website = 'https://mxstbr.com/bla';
    // Change website
    cy.get('[data-cy="community-settings-website-input"]')
      .clear()
      .type(website);
    // Submit changes
    cy.get('[data-cy="community-settings-edit-save-button"]').click();
    cy.visit(`/${community.slug}`);
    cy.location('pathname').should('eq', `/${community.slug}`);
    // Make sure changes were applied
    cy.contains(description);
    cy.contains(name);
    cy.contains(website);
    // Revert changes
    cy.visit(`/${community.slug}/settings`);
    cy.get('[data-cy="community-settings-name-input"]')
      .clear()
      .type(community.name);
    cy.get('[data-cy="community-settings-description-input"]')
      .clear()
      .type(community.description);
    cy.get('[data-cy="community-settings-website-input"]')
      .clear()
      .type(community.website);
    cy.get('[data-cy="community-settings-edit-save-button"]').click();
    cy.visit(`/${community.slug}`);
    cy.location('pathname').should('eq', `/${community.slug}`);
    cy.contains(community.name);
    cy.contains(community.description);
    cy.contains(community.website);
  });

  it.skip('should allow managing branded login settings', () => {
    const brandedLoginString = 'Testing branded login custom message';

    // click the enable custom branded login toggle
    cy.get('[data-cy="community-settings-branded-login"]')
      .contains('Enable custom branded login')
      .click();

    // should be enabled and input should appear
    cy.get('[data-cy="community-settings-branded-login-input"]').should(
      'be.visible'
    );

    // type in a new branded login string
    cy.get('[data-cy="community-settings-branded-login-input"]')
      .click()
      .type(brandedLoginString);

    // save the string
    cy.get('[data-cy="community-settings-branded-login-save"]')
      .should('be.visible')
      .click();

    // go to the preview page
    cy.get('[data-cy="community-settings-branded-login-preview"]')
      .should('be.visible')
      .click();

    // custom string should be visible
    cy.get('[data-cy="community-login-page"]')
      .contains(brandedLoginString)
      .should('be.visible');

    // go back to settings
    cy.visit(`/${community.slug}/settings`);

    // disable branded login
    cy.get('[data-cy="community-settings-branded-login"]')
      .contains('Enable custom branded login')
      .click();
  });
});
