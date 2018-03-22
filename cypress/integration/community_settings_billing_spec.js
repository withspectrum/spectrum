import data from '../../shared/testing/data';

const community = data.communities.find(c => c.slug === 'payments-test');
const members = data.usersCommunities
  .filter(
    ({ communityId, isMember }) => community.id === communityId && isMember
  )
  .map(({ userId }) => data.users.find(({ id }) => id === userId));
const { userId: ownerId } = data.usersCommunities.find(
  ({ communityId, isOwner }) => communityId === community.id && isOwner
);
const channels = data.channels.filter(
  ({ communityId }) => community.id === communityId
);

describe('Community settings billing tab', () => {
  beforeEach(() => {
    cy.auth(ownerId);
  });

  describe('should prompt for admin email verification', () => {
    it('should show administrator email form', () => {
      cy.visit(`/${community.slug}/settings`);
      cy
        .get(`[href="/${community.slug}/settings/billing"]`)
        .should('be.visible')
        .click();
      cy
        .get('[data-e2e-id="community-settings-billing-admin-email-form"]')
        .should('be.visible');

      // Editing
      const badEmail = 'foo';
      const goodEmail = 'briandlovin@gmail.com';

      // Enter bad email
      cy
        .get('input[type="email"]')
        .clear()
        .type(`${badEmail}`);

      // Submit changes
      cy.get('button[type="submit"]').click();

      // should show error
      cy
        .get('[data-e2e-id="administrator-email-form-error"]')
        .should('be.visible');

      // Enter good email
      cy
        .get('input[type="email"]')
        .click()
        .clear()
        .type(`${goodEmail}`);

      // Submit changes
      cy.get('button[type="submit"]').click();

      // should show pending notice
      cy
        .get('[data-e2e-id="administrator-email-form-pending-sent"]')
        .should('be.visible');
    });
  });

  describe('should force verification of administration email', () => {
    it('should verify email address', () => {
      cy.visit(`http://localhost:3001/api/email/validate/test-payments/verify`);
    });
  });

  describe('should be able to view billing settings with save administrator email', () => {
    it('should load community billing settings', () => {
      cy.visit(`/${community.slug}/settings`);
      cy
        .get(`[href="/${community.slug}/settings/billing"]`)
        .should('be.visible')
        .click();
      cy.get('[data-e2e-id="community-settings-billing"]').should('be.visible');
    });
  });

  // as the last test, reset the administrator email
  describe('should reset the administration email', () => {
    it('should reset email addres', () => {
      cy.visit(`http://localhost:3001/api/email/validate/test-payments/reset`);
    });
  });

  describe('should have successfully reset the administration email', () => {
    it('should show administrator email form', () => {
      cy.visit(`/${community.slug}/settings`);
      cy
        .get(`[href="/${community.slug}/settings/billing"]`)
        .should('be.visible')
        .click();
      cy
        .get('[data-e2e-id="community-settings-billing-admin-email-form"]')
        .should('be.visible');
    });
  });
});
