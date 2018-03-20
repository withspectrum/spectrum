import data from '../../shared/testing/data';

const community = data.communities[0];
const { userId: ownerId } = data.usersCommunities.find(
  ({ communityId, isOwner }) => communityId === community.id && isOwner
);
const channels = data.channels.filter(
  ({ communityId }) => community.id === communityId
);

describe('Community View', () => {
  beforeEach(() => {
    cy.auth(ownerId);
    cy.visit(`/${community.slug}/settings`);
  });

  it('should render the settings overview', () => {
    cy.get('[data-e2e-id="community-settings"]').should('be.visible');
    cy.contains('Channels');
    // Make sure all channels are listed and link to their settings
    channels.forEach(channel => {
      cy.contains(channel.name);
      cy.get(`[href*="${community.slug}/${channel.slug}/settings"]`);
    });
  });

  it('should allow changing the community name', () => {
    const name = 'text';
    // Change name
    cy
      .get('[data-e2e-id="community-settings-name-input"]')
      .clear()
      .type(`${name}{enter}`);
    cy.location('pathname').should('eq', `/${community.slug}`);
    cy.contains(name);
    // Revert name change again
    cy.visit(`/${community.slug}/settings`);
    cy
      .get('[data-e2e-id="community-settings-name-input"]')
      .clear()
      .type(community.name + '{enter}');
    cy.location('pathname').should('eq', `/${community.slug}`);
    cy.contains(community.name);
  });

  it('should allow changing the community description', () => {
    const description = 'text';
    // Change description
    cy
      .get('[data-e2e-id="community-settings-description-input"]')
      .clear()
      .type(description);
    // TODO(@mxstbr): Make description input submit on enter
    cy.get('button[type="submit"]').click();
    cy.location('pathname').should('eq', `/${community.slug}`);
    cy.contains(description);
    // Revert description change again
    cy.visit(`/${community.slug}/settings`);
    cy
      .get('[data-e2e-id="community-settings-description-input"]')
      .clear()
      .type(community.description);
    // TODO(@mxstbr): Make description input submit on enter
    cy.get('button[type="submit"]').click();
    cy.location('pathname').should('eq', `/${community.slug}`);
    cy.contains(community.description);
  });

  it('should allow changing the community website', () => {
    const website = 'https://mxstbr.com/bla';
    // Change website
    cy
      .get('[data-e2e-id="community-settings-website-input"]')
      .clear()
      .type(website);
    // TODO(@mxstbr): Make website input submit on enter
    cy.get('button[type="submit"]').click();
    cy.location('pathname').should('eq', `/${community.slug}`);
    cy.contains(website);
    // Revert website change again
    cy.visit(`/${community.slug}/settings`);
    cy
      .get('[data-e2e-id="community-settings-website-input"]')
      .clear()
      .type(community.website);
    // TODO(@mxstbr): Make website input submit on enter
    cy.get('button[type="submit"]').click();
    cy.location('pathname').should('eq', `/${community.slug}`);
    cy.contains(community.website);
  });
});
