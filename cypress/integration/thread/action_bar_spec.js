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
  cy.get('[data-cy="thread-dropdown-lock"]')
    .first()
    .click();
  cy.get('[data-cy="thread-dropdown-lock"]').contains('Unlock chat');

  // unlock the thread
  cy.get('[data-cy="thread-dropdown-lock"]')
    .first()
    .click();
  cy.get('[data-cy="thread-dropdown-lock"]').contains('Lock chat');
};

const pinThread = () => {
  // pin the thread
  cy.get('[data-cy="thread-dropdown-pin"]')
    .first()
    .click();
  cy.get('[data-cy="thread-dropdown-pin"]').contains('Unpin');

  // unpin the thread
  cy.get('[data-cy="thread-dropdown-pin"]')
    .first()
    .click();
  cy.get('[data-cy="thread-dropdown-pin"]').contains('Pin');
};

const triggerThreadDelete = () => {
  cy.get('[data-cy="thread-dropdown-delete"]')
    .first()
    .click();
  cy.get('[data-cy="delete-button"]').should('be.visible');
  cy.get('div.ReactModal__Overlay')
    .should('be.visible')
    .click('topLeft');
};

const triggerMovingThread = () => {
  cy.get('[data-cy="thread-dropdown-move"]')
    .first()
    .click();
  cy.get('[data-cy="move-thread-modal"]').should('be.visible');
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
      cy.get('[data-cy="thread-facebook-button"]').should('be.visible');
      cy.get('[data-cy="thread-tweet-button"]').should('be.visible');
      cy.get('[data-cy="thread-copy-link-button"]').should('be.visible');
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
      cy.get('[data-cy="thread-facebook-button"]').should('be.visible');
      cy.get('[data-cy="thread-tweet-button"]').should('be.visible');
      cy.get('[data-cy="thread-copy-link-button"]').should('be.visible');
      cy.get('[data-cy="thread-actions-dropdown-trigger"]').should(
        'be.visible'
      );
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
      cy.get('[data-cy="thread-facebook-button"]').should('be.visible');
      cy.get('[data-cy="thread-tweet-button"]').should('be.visible');
      cy.get('[data-cy="thread-copy-link-button"]').should('be.visible');
      cy.get('[data-cy="thread-actions-dropdown-trigger"]').should(
        'be.visible'
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
      cy.get('[data-cy="thread-facebook-button"]').should('not.be.visible');
      cy.get('[data-cy="thread-tweet-button"]').should('not.be.visible');
      cy.get('[data-cy="thread-copy-link-button"]').should('be.visible');
      cy.get('[data-cy="thread-actions-dropdown-trigger"]').should(
        'be.visible'
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
      cy.get('[data-cy="thread-facebook-button"]').should('be.visible');
      cy.get('[data-cy="thread-tweet-button"]').should('be.visible');
      cy.get('[data-cy="thread-copy-link-button"]').should('be.visible');

      openSettingsDropdown();

      cy.get('[data-cy="thread-actions-dropdown"]').should('be.visible');

      // dropdown controls
      cy.get('[data-cy="thread-dropdown-edit"]').should('be.visible');
      cy.get('[data-cy="thread-dropdown-pin"]').should('not.be.visible');
      cy.get('[data-cy="thread-dropdown-move"]').should('not.be.visible');
      cy.get('[data-cy="thread-dropdown-lock"]').should('be.visible');
      cy.get('[data-cy="thread-dropdown-delete"]').should('be.visible');
      cy.get('[data-cy="thread-dropdown-notifications"]').should('be.visible');
    });

    it('should lock the thread', () => {
      cy.auth(publicThreadAuthor.id);
      openSettingsDropdown();
      lockThread();
    });

    it('should trigger delete thread', () => {
      cy.auth(publicThreadAuthor.id);
      openSettingsDropdown();
      triggerThreadDelete();
    });

    it('should edit the thread', () => {
      cy.auth(publicThreadAuthor.id);

      openSettingsDropdown();
      cy.get('[data-cy="thread-actions-dropdown-trigger"]').should(
        'be.visible'
      );
      cy.get('[data-cy="thread-dropdown-edit"]').click();
      cy.get('[data-cy="save-thread-edit-button"]').should('be.visible');
      const title = 'Some new thread';
      cy.get('[data-cy="rich-text-editor"]').should('be.visible');
      cy.get('[data-cy="composer-title-input"]')
        .clear()
        .type(title);
      cy.get('[data-cy="save-thread-edit-button"]').click();
      cy.get('[data-cy="thread-view"]');
      cy.contains(title);

      // undo the edit
      openSettingsDropdown();
      cy.get('[data-cy="thread-actions-dropdown-trigger"]')
        .should('be.visible')
        .last()
        .click();
      cy.get('[data-cy="thread-dropdown-edit"]').click();
      cy.get('[data-cy="save-thread-edit-button"]').should('be.visible');
      const originalTitle = 'The first thread! 🎉';
      cy.get('[data-cy="rich-text-editor"]').should('be.visible');
      cy.get('[data-cy="composer-title-input"]')
        .clear()
        .type(originalTitle);
      cy.get('[data-cy="save-thread-edit-button"]').click();
      cy.get('[data-cy="thread-view"]');
      cy.contains('The first thread! 🎉');
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
      cy.get('[data-cy="thread-facebook-button"]').should('be.visible');
      cy.get('[data-cy="thread-tweet-button"]').should('be.visible');
      cy.get('[data-cy="thread-copy-link-button"]').should('be.visible');

      openSettingsDropdown();

      cy.get('[data-cy="thread-actions-dropdown"]').should('be.visible');

      // dropdown controls
      cy.get('[data-cy="thread-dropdown-pin"]').should('not.be.visible');
      cy.get('[data-cy="thread-dropdown-move"]').should('not.be.visible');
      cy.get('[data-cy="thread-dropdown-edit"]').should('be.visible');
      cy.get('[data-cy="thread-dropdown-lock"]').should('be.visible');
      cy.get('[data-cy="thread-dropdown-delete"]').should('be.visible');
      cy.get('[data-cy="thread-dropdown-notifications"]').should('be.visible');
    });

    it('should lock the thread', () => {
      cy.auth(constants.CHANNEL_MODERATOR_USER_ID);

      openSettingsDropdown();
      lockThread();
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
      cy.get('[data-cy="thread-facebook-button"]').should('be.visible');
      cy.get('[data-cy="thread-tweet-button"]').should('be.visible');
      cy.get('[data-cy="thread-copy-link-button"]').should('be.visible');

      openSettingsDropdown();

      cy.get('[data-cy="thread-actions-dropdown"]').should('be.visible');

      // dropdown controls
      cy.get('[data-cy="thread-dropdown-pin"]').should('not.be.visible');
      cy.get('[data-cy="thread-dropdown-move"]').should('not.be.visible');
      cy.get('[data-cy="thread-dropdown-edit"]').should('be.visible');
      cy.get('[data-cy="thread-dropdown-lock"]').should('be.visible');
      cy.get('[data-cy="thread-dropdown-delete"]').should('be.visible');
      cy.get('[data-cy="thread-dropdown-notifications"]').should('be.visible');
    });

    it('should lock the thread', () => {
      cy.auth(constants.CHANNEL_MODERATOR_USER_ID);

      openSettingsDropdown();
      lockThread();
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
      cy.get('[data-cy="thread-facebook-button"]').should('be.visible');
      cy.get('[data-cy="thread-tweet-button"]').should('be.visible');
      cy.get('[data-cy="thread-copy-link-button"]').should('be.visible');

      openSettingsDropdown();

      cy.get('[data-cy="thread-actions-dropdown"]').should('be.visible');

      // dropdown controls
      cy.get('[data-cy="thread-dropdown-pin"]').should('be.visible');
      cy.get('[data-cy="thread-dropdown-move"]').should('be.visible');
      cy.get('[data-cy="thread-dropdown-lock"]').should('be.visible');
      cy.get('[data-cy="thread-dropdown-delete"]').should('be.visible');
      cy.get('[data-cy="thread-dropdown-edit"]').should('be.visible');
      cy.get('[data-cy="thread-dropdown-notifications"]').should('be.visible');
    });

    it('should lock the thread', () => {
      cy.auth(constants.COMMUNITY_MODERATOR_USER_ID);

      openSettingsDropdown();
      lockThread();
    });

    it('should pin the thread', () => {
      cy.auth(constants.COMMUNITY_MODERATOR_USER_ID);

      openSettingsDropdown();
      pinThread();
    });

    it('should trigger moving the thread', () => {
      cy.auth(constants.COMMUNITY_MODERATOR_USER_ID);

      openSettingsDropdown();
      triggerMovingThread();
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
      cy.get('[data-cy="thread-facebook-button"]').should('be.visible');
      cy.get('[data-cy="thread-tweet-button"]').should('be.visible');
      cy.get('[data-cy="thread-copy-link-button"]').should('be.visible');

      openSettingsDropdown();

      cy.get('[data-cy="thread-actions-dropdown"]').should('be.visible');

      // dropdown controls
      cy.get('[data-cy="thread-dropdown-pin"]').should('be.visible');
      cy.get('[data-cy="thread-dropdown-move"]').should('be.visible');
      cy.get('[data-cy="thread-dropdown-lock"]').should('be.visible');
      cy.get('[data-cy="thread-dropdown-delete"]').should('be.visible');
      cy.get('[data-cy="thread-dropdown-edit"]').should('be.visible');
      cy.get('[data-cy="thread-dropdown-notifications"]').should('be.visible');
    });

    it('should lock the thread', () => {
      cy.auth(constants.MAX_ID);

      openSettingsDropdown();
      lockThread();
    });

    it('should pin the thread', () => {
      cy.auth(constants.MAX_ID);

      openSettingsDropdown();
      pinThread();
    });

    it('should trigger moving the thread', () => {
      cy.auth(constants.MAX_ID);

      openSettingsDropdown();
      triggerMovingThread();
    });

    it('should trigger delete thread', () => {
      cy.auth(constants.MAX_ID);

      openSettingsDropdown();
      triggerThreadDelete();
    });
  });
});
