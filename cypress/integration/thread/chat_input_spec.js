import data from '../../../shared/testing/data';
import constants from '../../../api/migrations/seed/default/constants';

const publicChannel = data.channels.find(
  c => c.id === constants.SPECTRUM_GENERAL_CHANNEL_ID
);
const archivedChannel = data.channels.find(
  c => c.id === constants.SPECTRUM_ARCHIVED_CHANNEL_ID
);

const publicCommunity = data.communities.find(
  c => c.id === constants.SPECTRUM_COMMUNITY_ID
);

const publicThread = data.threads.find(
  t => t.communityId === publicCommunity.id && t.channelId === publicChannel.id
);
const archivedThread = data.threads.find(
  t =>
    t.communityId === publicCommunity.id && t.channelId === archivedChannel.id
);
const lockedThread = data.threads.find(t => t.isLocked);

const nonMemberUser = data.users.find(u => u.id === constants.QUIET_USER_ID);
const memberInChannelUser = data.users.find(u => u.id === constants.BRIAN_ID);

describe('chat input', () => {
  describe('non authed', () => {
    beforeEach(() => {
      cy.visit(`/thread/${publicThread.id}`);
    });

    it('should render', () => {
      cy.get('[data-cy="thread-view"]').should('be.visible');
      cy.get('[data-cy="chat-input-send-button"]').should('be.visible');
      cy.get('[data-cy="chat-input-media-uploader"]').should('not.be.visible');
      cy.get('[data-cy="markdownHint"]').should('have.css', 'opacity', '0');

      const newMessage = 'A new message!';
      cy.get('[contenteditable="true"]').type(newMessage);
      cy.get('[data-cy="markdownHint"]').should('have.css', 'opacity', '1');
      // Wait for the messages to be loaded before sending new message
      cy.get('[data-cy="message-group"]').should('be.visible');
      cy.get('[data-cy="chat-input-send-button"]').click();
      cy.contains('Sign in');
    });
  });

  describe('authed non member', () => {
    beforeEach(() => {
      cy.auth(nonMemberUser.id);
      cy.visit(`/thread/${publicThread.id}`);
    });

    it('should render', () => {
      cy.get('[data-cy="thread-view"]').should('be.visible');
      cy.get('[data-cy="chat-input-send-button"]').should('not.be.visible');
      cy
        .get('[data-cy="thread-join-channel-upsell-button"]')
        .should('be.visible');
    });
  });

  describe('authed member', () => {
    beforeEach(() => {
      cy.auth(memberInChannelUser.id);
      cy.visit(`/thread/${publicThread.id}`);
    });

    it('should render', () => {
      cy.get('[data-cy="thread-view"]').should('be.visible');
      cy.get('[data-cy="chat-input-send-button"]').should('be.visible');
    });

    it('should allow authed members to send messages', () => {
      const newMessage = 'A new message!';
      cy.get('[data-cy="thread-view"]').should('be.visible');
      cy.get('[contenteditable="true"]').type(newMessage);
      // Wait for the messages to be loaded before sending new message
      cy.get('[data-cy="message-group"]').should('be.visible');
      cy.get('[data-cy="chat-input-send-button"]').click();
      // Clear the chat input and make sure the message was sent by matching the text
      cy.get('[contenteditable="true"]').type('');
      cy.contains(newMessage);
    });
  });

  describe('message attachments', () => {
    beforeEach(() => {
      cy.auth(memberInChannelUser.id);
      cy.visit(`/thread/${publicThread.id}`);
    });

    it('should allow quoting a message', () => {
      // Quote a message
      cy.get('[data-cy="staged-quoted-message"]').should('not.be.visible');
      cy
        .get('[data-cy="message"]')
        .first()
        .should('be.visible')
        .click();
      cy
        .get('[data-cy="reply-to-message"]')
        .first()
        .should('be.visible')
        .click();
      cy
        .get('[data-cy="reply-to-message"]')
        .first()
        .should('not.be.visible');
      cy.get('[data-cy="staged-quoted-message"]').should('be.visible');
      // Remove quoted message again
      cy
        .get('[data-cy="remove-staged-quoted-message"]')
        .should('be.visible')
        .click();
      cy.get('[data-cy="staged-quoted-message"]').should('not.be.visible');
    });
  });

  // NOTE(@mxstbr): This fails in CI, but not locally for some reason
  // we should fix This
  // FIXME
  // describe('locked thread', () => {
  //   beforeEach(() => {
  //     cy.auth(memberInChannelUser.id);
  //     cy.visit(`/thread/${lockedThread.id}`);
  //   });

  //   it('should render', () => {
  //     cy.get('[data-cy="chat-input-send-button"]').should('not.be.visible');
  //     cy.contains('This conversation has been locked');
  //   });
  // });

  describe('thread in archived channel', () => {
    beforeEach(() => {
      cy.auth(memberInChannelUser.id);
      cy.visit(`/thread/${archivedThread.id}`);
    });

    it('should render', () => {
      cy.get('[data-cy="chat-input-send-button"]').should('not.be.visible');
    });
  });
});
