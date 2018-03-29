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

const lockThread = () => {
  // lock the thread
  cy.get('[data-cy="thread-dropdown-lock"]').contains('Lock chat');
  cy.get('[data-cy="thread-dropdown-lock"]').click();
  cy.get('[data-cy="thread-dropdown-lock"]').should('be.disabled');
  cy.get('[data-cy="thread-dropdown-lock"]').should('not.be.disabled');
  cy.get('[data-cy="thread-dropdown-lock"]').contains('Unlock chat');

  // unlock the thread
  cy.get('[data-cy="thread-dropdown-lock"]').click();
  cy.get('[data-cy="thread-dropdown-lock"]').should('be.disabled');
  cy.get('[data-cy="thread-dropdown-lock"]').should('not.be.disabled');
  cy.get('[data-cy="thread-dropdown-lock"]').contains('Lock chat');
};

const pinThread = () => {
  // pin the thread
  cy.get('[data-cy="thread-dropdown-pin"]').click();
  cy.get('[data-cy="thread-dropdown-pin"]').should('be.disabled');
  cy.get('[data-cy="thread-dropdown-pin"]').should('not.be.disabled');
  cy.get('[data-cy="thread-dropdown-pin"]').contains('Unpin');

  // unpin the thread
  cy.get('[data-cy="thread-dropdown-pin"]').click();
  cy.get('[data-cy="thread-dropdown-pin"]').should('be.disabled');
  cy.get('[data-cy="thread-dropdown-pin"]').should('not.be.disabled');
  cy.get('[data-cy="thread-dropdown-pin"]').contains('Pin');
};

const triggerThreadDelete = () => {
  cy.get('[data-cy="thread-dropdown-delete"]').click();
  cy.get('[data-cy="delete-button"]').should('be.visible');
  cy
    .get('div.ReactModal__Overlay')
    .should('be.visible')
    .click('topLeft');
};

const triggerMovingThread = () => {
  cy.get('[data-cy="thread-dropdown-move"]').click();
  cy.get('[data-cy="move-thread-modal"]').should('be.visible');
  cy
    .get('div.ReactModal__Overlay')
    .should('be.visible')
    .click('topLeft');
};

describe('action bar renders', () => {
  describe('non authed', () => {
    before(() => {
      cy.visit(`/thread/${publicThread.id}`);
    });

    it('should render', () => {
      cy.get('[data-cy="thread-view"]').should('be.visible');
      cy
        .get('[data-cy="thread-notifications-login-capture"]')
        .should('be.visible');
      cy.get('[data-cy="thread-facebook-button"]').should('be.visible');
      cy.get('[data-cy="thread-tweet-button"]').should('be.visible');
      cy.get('[data-cy="thread-copy-link-button"]').should('be.visible');
      cy
        .get('[data-cy="thread-actions-dropdown-trigger"]')
        .should('not.be.visible');
    });
  });

  describe('authed non member', () => {
    before(() => {
      cy.auth(nonMemberUser.id);
      cy.visit(`/thread/${publicThread.id}`);
    });

    it('should render', () => {
      cy.get('[data-cy="thread-view"]').should('be.visible');
      cy.get('[data-cy="thread-notifications-toggle"]').should('be.visible');
      cy.get('[data-cy="thread-facebook-button"]').should('be.visible');
      cy.get('[data-cy="thread-tweet-button"]').should('be.visible');
      cy.get('[data-cy="thread-copy-link-button"]').should('be.visible');
      cy
        .get('[data-cy="thread-actions-dropdown-trigger"]')
        .should('not.be.visible');
    });
  });

  describe('authed member', () => {
    before(() => {
      cy.auth(memberInChannelUser.id);
      cy.visit(`/thread/${publicThread.id}`);
    });

    it('should render', () => {
      cy.get('[data-cy="thread-view"]').should('be.visible');
      cy.get('[data-cy="thread-notifications-toggle"]').should('be.visible');
      cy.get('[data-cy="thread-facebook-button"]').should('be.visible');
      cy.get('[data-cy="thread-tweet-button"]').should('be.visible');
      cy.get('[data-cy="thread-copy-link-button"]').should('be.visible');
      cy
        .get('[data-cy="thread-actions-dropdown-trigger"]')
        .should('not.be.visible');
    });
  });

  describe('authed private channel member', () => {
    before(() => {
      cy.auth(memberInChannelUser.id);
      cy.visit(`/thread/${privateThread.id}`);
    });

    it('should render', () => {
      cy.get('[data-cy="thread-view"]').should('be.visible');
      cy.get('[data-cy="thread-notifications-toggle"]').should('be.visible');
      cy.get('[data-cy="thread-facebook-button"]').should('not.be.visible');
      cy.get('[data-cy="thread-tweet-button"]').should('not.be.visible');
      cy.get('[data-cy="thread-copy-link-button"]').should('not.be.visible');
      cy
        .get('[data-cy="thread-actions-dropdown-trigger"]')
        .should('not.be.visible');
    });
  });

  describe('thread author', () => {
    before(() => {
      cy.auth(publicThreadAuthor.id);
      cy.visit(`/thread/${publicThread.id}`);
    });

    it('should render', () => {
      cy.get('[data-cy="thread-view"]').should('be.visible');
      cy.get('[data-cy="thread-notifications-toggle"]').should('be.visible');
      cy.get('[data-cy="thread-facebook-button"]').should('be.visible');
      cy.get('[data-cy="thread-tweet-button"]').should('be.visible');
      cy.get('[data-cy="thread-copy-link-button"]').should('be.visible');
      cy
        .get('[data-cy="thread-actions-dropdown-trigger"]')
        .should('be.visible')
        .click();
      cy.get('[data-cy="thread-actions-dropdown"]').should('be.visible');

      // dropdown controls
      cy.get('[data-cy="thread-dropdown-edit"]').should('be.visible');
      cy.get('[data-cy="thread-dropdown-pin"]').should('not.be.visible');
      cy.get('[data-cy="thread-dropdown-move"]').should('not.be.visible');
      cy.get('[data-cy="thread-dropdown-lock"]').should('be.visible');
      cy.get('[data-cy="thread-dropdown-delete"]').should('be.visible');
    });

    it('should lock the thread', () => {
      cy.auth(publicThreadAuthor.id);

      lockThread();
    });

    it('should trigger delete thread', () => {
      cy.auth(publicThreadAuthor.id);

      triggerThreadDelete();
    });

    it('should edit the thread', () => {
      cy.auth(publicThreadAuthor.id);

      cy.get('[data-cy="thread-dropdown-edit"]').click();
      cy.get('[data-cy="save-thread-edit-button"]').should('be.visible');
      const title = 'Some new thread';
      cy.get('[data-cy="rich-text-editor"]').should('be.visible');
      cy
        .get('[data-cy="thread-editor-title-input"]')
        .clear()
        .type(title);
      cy.get('[data-cy="save-thread-edit-button"]').click();
      cy.get('[data-cy="save-thread-edit-button"]').should('be.disabled');
      cy.get('[data-cy="save-thread-edit-button"]').should('not.be.disabled');
      cy.get('[data-cy="thread-view"]');
      cy.contains(title);

      // undo the edit
      cy.get('[data-cy="thread-dropdown-edit"]').click();
      cy.get('[data-cy="save-thread-edit-button"]').should('be.visible');
      const originalTitle = 'The first thread! 🎉';
      cy.get('[data-cy="rich-text-editor"]').should('be.visible');
      cy
        .get('[data-cy="thread-editor-title-input"]')
        .clear()
        .type(originalTitle);
      cy.get('[data-cy="save-thread-edit-button"]').click();
      cy.get('[data-cy="save-thread-edit-button"]').should('be.disabled');
      cy.get('[data-cy="save-thread-edit-button"]').should('not.be.disabled');
      cy.get('[data-cy="thread-view"]');
      cy.contains('The first thread! 🎉');
    });
  });

  describe('channel moderator', () => {
    before(() => {
      cy.auth(constants.CHANNEL_MODERATOR_USER_ID);
      cy.visit(`/thread/${publicThread.id}`);
    });

    it('should render', () => {
      cy.get('[data-cy="thread-view"]').should('be.visible');
      cy.get('[data-cy="thread-notifications-toggle"]').should('be.visible');
      cy.get('[data-cy="thread-facebook-button"]').should('be.visible');
      cy.get('[data-cy="thread-tweet-button"]').should('be.visible');
      cy.get('[data-cy="thread-copy-link-button"]').should('be.visible');
      cy
        .get('[data-cy="thread-actions-dropdown-trigger"]')
        .should('be.visible')
        .click();
      cy.get('[data-cy="thread-actions-dropdown"]').should('be.visible');

      // dropdown controls
      cy.get('[data-cy="thread-dropdown-edit"]').should('not.be.visible');
      cy.get('[data-cy="thread-dropdown-pin"]').should('not.be.visible');
      cy.get('[data-cy="thread-dropdown-move"]').should('not.be.visible');
      cy.get('[data-cy="thread-dropdown-lock"]').should('be.visible');
      cy.get('[data-cy="thread-dropdown-delete"]').should('be.visible');
    });

    it('should lock the thread', () => {
      cy.auth(constants.CHANNEL_MODERATOR_USER_ID);

      // lock the thread
      lockThread();
    });

    it('should trigger delete thread', () => {
      cy.auth(constants.CHANNEL_MODERATOR_USER_ID);

      triggerThreadDelete();
    });
  });

  describe('channel owner', () => {
    before(() => {
      cy.auth(constants.CHANNEL_MODERATOR_USER_ID);
      cy.visit(`/thread/${publicThread.id}`);
    });

    it('should render', () => {
      cy.get('[data-cy="thread-view"]').should('be.visible');
      cy.get('[data-cy="thread-notifications-toggle"]').should('be.visible');
      cy.get('[data-cy="thread-facebook-button"]').should('be.visible');
      cy.get('[data-cy="thread-tweet-button"]').should('be.visible');
      cy.get('[data-cy="thread-copy-link-button"]').should('be.visible');
      cy
        .get('[data-cy="thread-actions-dropdown-trigger"]')
        .should('be.visible')
        .click();
      cy.get('[data-cy="thread-actions-dropdown"]').should('be.visible');

      // dropdown controls
      cy.get('[data-cy="thread-dropdown-edit"]').should('not.be.visible');
      cy.get('[data-cy="thread-dropdown-pin"]').should('not.be.visible');
      cy.get('[data-cy="thread-dropdown-move"]').should('not.be.visible');
      cy.get('[data-cy="thread-dropdown-lock"]').should('be.visible');
      cy.get('[data-cy="thread-dropdown-delete"]').should('be.visible');
    });

    it('should lock the thread', () => {
      cy.auth(constants.CHANNEL_MODERATOR_USER_ID);

      lockThread();
    });

    it('should trigger delete thread', () => {
      cy.auth(constants.CHANNEL_MODERATOR_USER_ID);

      triggerThreadDelete();
    });
  });

  describe('community moderator', () => {
    before(() => {
      cy.auth(constants.COMMUNITY_MODERATOR_USER_ID);
      cy.visit(`/thread/${publicThread.id}`);
    });

    it('should render', () => {
      cy.get('[data-cy="thread-view"]').should('be.visible');
      cy.get('[data-cy="thread-notifications-toggle"]').should('be.visible');
      cy.get('[data-cy="thread-facebook-button"]').should('be.visible');
      cy.get('[data-cy="thread-tweet-button"]').should('be.visible');
      cy.get('[data-cy="thread-copy-link-button"]').should('be.visible');
      cy
        .get('[data-cy="thread-actions-dropdown-trigger"]')
        .should('be.visible')
        .click();
      cy.get('[data-cy="thread-actions-dropdown"]').should('be.visible');

      // dropdown controls
      cy.get('[data-cy="thread-dropdown-edit"]').should('not.be.visible');
      cy.get('[data-cy="thread-dropdown-pin"]').should('be.visible');
      cy.get('[data-cy="thread-dropdown-move"]').should('be.visible');
      cy.get('[data-cy="thread-dropdown-lock"]').should('be.visible');
      cy.get('[data-cy="thread-dropdown-delete"]').should('be.visible');
    });

    it('should lock the thread', () => {
      cy.auth(constants.COMMUNITY_MODERATOR_USER_ID);

      lockThread();
    });

    it('should pin the thread', () => {
      cy.auth(constants.COMMUNITY_MODERATOR_USER_ID);

      pinThread();
    });

    it('should trigger moving the thread', () => {
      cy.auth(constants.COMMUNITY_MODERATOR_USER_ID);

      triggerMovingThread();
    });

    it('should trigger delete thread', () => {
      cy.auth(constants.COMMUNITY_MODERATOR_USER_ID);

      triggerThreadDelete();
    });
  });

  describe('community owner', () => {
    before(() => {
      cy.auth(constants.MAX_ID);
      cy.visit(`/thread/${publicThread.id}`);
    });

    it('should render', () => {
      cy.get('[data-cy="thread-view"]').should('be.visible');
      cy.get('[data-cy="thread-notifications-toggle"]').should('be.visible');
      cy.get('[data-cy="thread-facebook-button"]').should('be.visible');
      cy.get('[data-cy="thread-tweet-button"]').should('be.visible');
      cy.get('[data-cy="thread-copy-link-button"]').should('be.visible');
      cy
        .get('[data-cy="thread-actions-dropdown-trigger"]')
        .should('be.visible')
        .click();
      cy.get('[data-cy="thread-actions-dropdown"]').should('be.visible');

      // dropdown controls
      cy.get('[data-cy="thread-dropdown-edit"]').should('not.be.visible');
      cy.get('[data-cy="thread-dropdown-pin"]').should('be.visible');
      cy.get('[data-cy="thread-dropdown-move"]').should('be.visible');
      cy.get('[data-cy="thread-dropdown-lock"]').should('be.visible');
      cy.get('[data-cy="thread-dropdown-delete"]').should('be.visible');
    });

    it('should lock the thread', () => {
      cy.auth(constants.MAX_ID);

      lockThread();
    });

    it('should pin the thread', () => {
      cy.auth(constants.MAX_ID);

      pinThread();
    });

    it('should trigger moving the thread', () => {
      cy.auth(constants.MAX_ID);

      triggerMovingThread();
    });

    it('should trigger delete thread', () => {
      cy.auth(constants.MAX_ID);

      triggerThreadDelete();
    });
  });
});
