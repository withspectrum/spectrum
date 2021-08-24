import data from '../../../shared/testing/data';
import constants from '../../../api/migrations/seed/default/constants';

const publicChannel = data.channels.find(
  c => c.id === constants.SPECTRUM_GENERAL_CHANNEL_ID
);
const privateChannel = data.channels.find(
  c => c.id === constants.SPECTRUM_PRIVATE_CHANNEL_ID
);

const publicCommunity = data.communities.find(
  c => c.id === constants.SPECTRUM_COMMUNITY_ID
);

const publicThread = data.threads.find(
  t => t.communityId === publicCommunity.id && t.channelId === publicChannel.id
);
const privateThread = data.threads.find(
  t => t.communityId === publicCommunity.id && t.channelId === privateChannel.id
);

const publicThreadAuthor = data.users.find(
  u => u.id === publicThread.creatorId
);

const nonMemberUser = data.users.find(u => u.id === constants.QUIET_USER_ID);
const memberInChannelUser = data.users.find(u => u.id === constants.BRYN_ID);

const triggerThreadDelete = () => {
  cy.get('[data-cy="thread-dropdown-delete"]')
    .first()
    .click();
  cy.get('[data-cy="delete-button"]').should('be.visible');
  cy.get('div.ReactModal__Overlay')
    .should('be.visible')
    .click('topLeft');
};

const openSettingsDropdown = () => {
  cy.get('[data-cy="thread-actions-dropdown-trigger"]')
    .last()
    .should('be.visible')
    .click({ force: true });
};

describe('action bar renders', () => {
  describe('non authed', () => {
    beforeEach(() => {
      cy.visit(`/thread/${publicThread.id}`);
    });

    it('should render', () => {
      cy.get('[data-cy="thread-view"]').should('be.visible');
      cy.get('[data-cy="thread-actions-dropdown-trigger"]').should(
        'not.be.visible'
      );
    });
  });

  describe('authed non member', () => {
    beforeEach(() => {
      cy.auth(nonMemberUser.id).then(() =>
        cy.visit(`/thread/${publicThread.id}`)
      );
    });

    it('should render', () => {
      cy.get('[data-cy="thread-view"]').should('be.visible');
    });
  });

  describe('authed member', () => {
    beforeEach(() => {
      cy.auth(memberInChannelUser.id).then(() =>
        cy.visit(`/thread/${publicThread.id}`)
      );
    });

    it('should render', () => {
      cy.get('[data-cy="thread-view"]').should('be.visible');
      cy.get('[data-cy="thread-actions-dropdown-trigger"]').should(
        'not.be.visible'
      );
    });
  });

  describe('authed private channel member', () => {
    beforeEach(() => {
      cy.auth(memberInChannelUser.id).then(() =>
        cy.visit(`/thread/${privateThread.id}`)
      );
    });

    it('should render', () => {
      cy.get('[data-cy="thread-view"]').should('be.visible');
      cy.get('[data-cy="thread-actions-dropdown-trigger"]').should(
        'not.be.visible'
      );
    });
  });

  describe('thread author', () => {
    beforeEach(() => {
      cy.auth(publicThreadAuthor.id).then(() =>
        cy.visit(`/thread/${publicThread.id}`)
      );
    });

    it('should render', () => {
      cy.get('[data-cy="thread-view"]').should('be.visible');

      openSettingsDropdown();

      cy.get('[data-cy="thread-actions-dropdown"]').should('be.visible');

      // dropdown controls
      cy.get('[data-cy="thread-dropdown-delete"]').should('be.visible');
    });

    it('should lock the thread', () => {
      cy.auth(publicThreadAuthor.id);
      openSettingsDropdown();
    });

    it('should trigger delete thread', () => {
      cy.auth(publicThreadAuthor.id);
      openSettingsDropdown();
      triggerThreadDelete();
    });
  });

  describe('channel moderator', () => {
    beforeEach(() => {
      cy.auth(constants.CHANNEL_MODERATOR_USER_ID).then(() =>
        cy.visit(`/thread/${publicThread.id}`)
      );
    });

    it('should render', () => {
      cy.get('[data-cy="thread-view"]').should('be.visible');

      openSettingsDropdown();

      cy.get('[data-cy="thread-actions-dropdown"]').should('be.visible');

      cy.get('[data-cy="thread-dropdown-delete"]').should('be.visible');
    });

    it('should trigger delete thread', () => {
      cy.auth(constants.CHANNEL_MODERATOR_USER_ID);

      openSettingsDropdown();
      triggerThreadDelete();
    });
  });

  describe('channel owner', () => {
    beforeEach(() => {
      cy.auth(constants.CHANNEL_MODERATOR_USER_ID).then(() =>
        cy.visit(`/thread/${publicThread.id}`)
      );
    });

    it('should render', () => {
      cy.get('[data-cy="thread-view"]').should('be.visible');

      openSettingsDropdown();

      cy.get('[data-cy="thread-actions-dropdown"]').should('be.visible');

      cy.get('[data-cy="thread-dropdown-delete"]').should('be.visible');
    });

    it('should trigger delete thread', () => {
      cy.auth(constants.CHANNEL_MODERATOR_USER_ID);

      openSettingsDropdown();
      triggerThreadDelete();
    });
  });

  describe('community moderator', () => {
    beforeEach(() => {
      cy.auth(constants.COMMUNITY_MODERATOR_USER_ID).then(() =>
        cy.visit(`/thread/${publicThread.id}`)
      );
    });

    it('should render', () => {
      cy.get('[data-cy="thread-view"]').should('be.visible');

      openSettingsDropdown();

      cy.get('[data-cy="thread-actions-dropdown"]').should('be.visible');

      cy.get('[data-cy="thread-dropdown-delete"]').should('be.visible');
    });

    it('should trigger delete thread', () => {
      cy.auth(constants.COMMUNITY_MODERATOR_USER_ID);

      openSettingsDropdown();
      triggerThreadDelete();
    });
  });

  describe('community owner', () => {
    beforeEach(() => {
      cy.auth(constants.MAX_ID).then(() =>
        cy.visit(`/thread/${publicThread.id}`)
      );
    });

    it('should render', () => {
      cy.get('[data-cy="thread-view"]').should('be.visible');

      openSettingsDropdown();

      cy.get('[data-cy="thread-actions-dropdown"]').should('be.visible');

      cy.get('[data-cy="thread-dropdown-delete"]').should('be.visible');
    });

    it('should trigger delete thread', () => {
      cy.auth(constants.MAX_ID);

      openSettingsDropdown();
      triggerThreadDelete();
    });
  });
});
