import data from '../../shared/testing/data';

const community = data.communities[0];

describe('Community View', () => {
  beforeEach(() => {
    cy.visit(`/${community.slug}`);
  });

  it('should render all the communities data, and show a list of channels and threads', () => {
    cy.get('[data-cy="community-view"]').should('be.visible');
    cy.contains(community.description);
    cy.contains(community.name);
    cy.contains(community.website);
    cy.get(`[src*="${community.profilePhoto}"]`).should('be.visible');
    // TODO: Actually use a Cypress API for this instead of this hacky shit
    cy.document().then(document => {
      expect(document.body.toString().indexOf(community.coverPhoto) > -1);
    });

    data.threads
      .filter(thread => thread.communityId === community.id)
      .forEach(thread => {
        cy.contains(thread.content.title).should('be.visible');
      });

    data.channels
      .filter(channel => channel.communityId === community.id)
      .forEach(channel => {
        cy.contains(channel.name).should('be.visible');
      });
  });
});
