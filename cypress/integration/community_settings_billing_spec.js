// @flow
import data from '../../shared/testing/data';

const community = data.communities.find(c => c.slug === 'payments');
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
        .get('[data-cy="community-settings-billing-admin-email-form"]')
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
      cy.get('[data-cy="administrator-email-form-error"]').should('be.visible');

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
        .get('[data-cy="administrator-email-form-pending-sent"]')
        .should('be.visible');

      // go to analytics tab
      cy
        .get(`[href="/${community.slug}/settings/analytics"]`)
        .should('be.visible')
        .click();

      // click unlock analytics
      cy
        .get('[data-cy="analytics-unlock-upsell-button"]')
        .should('be.visible')
        .click();

      // admin email verification modal should appear
      cy
        .get('[data-cy="admin-email-address-verification-modal"]')
        .should('be.visible');

      // click the overlay to close the modal
      cy
        .get('div.ReactModal__Overlay')
        .should('be.visible')
        .click('topLeft');

      // go to overview tab
      cy
        .get(`[href="/${community.slug}/settings"]`)
        .should('be.visible')
        .click();

      // create channel modal
      cy
        .get('[data-cy="create-channel-button"]')
        .should('be.visible')
        .click();

      // toggle private channel checkbox
      cy
        .get(
          '[data-cy="create-channel-modal-toggle-private-checkbox-unchecked"]'
        )
        .should('be.visible')
        .first()
        .click();

      // should prompt user to enter admin email
      cy
        .get('[data-cy="community-settings-create-channel-admin-email-prompt"]')
        .should('be.visible');

      // click the overlay to close the modal
      cy
        .get('div.ReactModal__Overlay')
        .should('be.visible')
        .click('topLeft');

      // go to members tab
      cy
        .get(`[href="/${community.slug}/settings/members"]`)
        .should('be.visible')
        .click();

      // should show list of members
      cy
        .get('[data-cy="community-settings-members-list"]')
        .should('be.visible');

      // click on the settings icon next to first user
      cy
        .get('[data-cy="community-settings-member-edit-dropdown-trigger"]')
        .first()
        .click();

      // click the moderator item in dropdown
      cy
        .get('[data-cy="community-settings-members-list"]')
        .contains('Can edit and delete conversations')
        .click();

      // admin email verification modal should appear
      cy
        .get('[data-cy="admin-email-address-verification-modal"]')
        .should('be.visible');

      // click the overlay to close the modal
      cy
        .get('div.ReactModal__Overlay')
        .should('be.visible')
        .click('topLeft');
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
      cy.get('[data-cy="community-settings-billing"]').should('be.visible');

      // go to analytics tab
      cy
        .get(`[href="/${community.slug}/settings/analytics"]`)
        .should('be.visible')
        .click();

      // click unlock analytics
      cy
        .get('[data-cy="analytics-unlock-upsell-button"]')
        .should('be.visible')
        .click();

      // admin email verification modal should appear
      cy.get('[data-cy="upgrade-analytics-modal"]').should('be.visible');

      // click the overlay to close the modal
      cy
        .get('div.ReactModal__Overlay')
        .should('be.visible')
        .click('topLeft');

      // go to overview tab
      cy
        .get(`[href="/${community.slug}/settings"]`)
        .should('be.visible')
        .click();

      // create channel modal
      cy
        .get('[data-cy="create-channel-button"]')
        .should('be.visible')
        .click();

      // toggle private channel checkbox
      cy
        .get(
          '[data-cy="create-channel-modal-toggle-private-checkbox-unchecked"]'
        )
        .should('be.visible')
        .first()
        .click();

      // should prompt user to enter admin email
      cy
        .get(
          '[data-cy="community-settings-create-channel-admin-add-source-prompt"]'
        )
        .should('be.visible');

      // click the overlay to close the modal
      cy
        .get('div.ReactModal__Overlay')
        .should('be.visible')
        .click('topLeft');

      // go to members tab
      cy
        .get(`[href="/${community.slug}/settings/members"]`)
        .should('be.visible')
        .click();

      // should show list of members
      cy
        .get('[data-cy="community-settings-members-list"]')
        .should('be.visible');

      // click on the settings icon next to first user
      cy
        .get('[data-cy="community-settings-member-edit-dropdown-trigger"]')
        .first()
        .click();

      // click the moderator item in dropdown
      cy
        .get('[data-cy="community-settings-members-list"]')
        .contains('Can edit and delete conversations')
        .click();

      // admin email verification modal should appear
      cy.get('[data-cy="upgrade-moderator-seat-modal"]').should('be.visible');

      // click the overlay to close the modal
      cy
        .get('div.ReactModal__Overlay')
        .should('be.visible')
        .click('topLeft');
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
        .get('[data-cy="community-settings-billing-admin-email-form"]')
        .should('be.visible');
    });
  });
});
