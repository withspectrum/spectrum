import { toPlainText, toState } from '../../shared/draft-utils';
import data from '../../shared/testing/data';
import {
  SPECTRUM_PRIVATE_CHANNEL_ID,
  QUIET_USER_ID,
} from '../../api/migrations/seed/default/constants';

// Public
const thread = data.threads[0];
const community = data.communities.find(
  community => community.id === thread.communityId
);
const author = data.users.find(user => user.id === thread.creatorId);
const messages = data.messages.filter(
  message => message.threadId === thread.id
);

// Private
const privateThread = data.threads.find(
  thread => thread.channelId === SPECTRUM_PRIVATE_CHANNEL_ID
);
const privateAuthor = data.users.find(
  user => user.id === privateThread.creatorId
);

describe('Thread View', () => {
  describe('Public', () => {
    beforeEach(() => {
      cy.visit(`/thread/${thread.id}`);
    });

    it('should render', () => {
      cy.get('[data-cy="thread-view"]').should('be.visible');
      cy.contains(thread.content.title);
      cy.contains(
        toPlainText(toState(JSON.parse(thread.content.body))).split(' ')[0]
      );
      cy.contains(author.name);
      cy.contains(author.username);
      cy.get(`[href*="/users/${author.username}"]`).should('be.visible');
      cy.get(`[href*="/${community.slug}"]`).should('be.visible');

      cy.get('[data-cy="message-group"]').should('be.visible');
      messages.forEach(message => {
        cy.contains(toPlainText(toState(JSON.parse(message.content.body))));
      });
    });

    it('should prompt logged-out users to log in', () => {
      const newMessage = 'A new message!';
      cy.get('[data-cy="thread-view"]').should('be.visible');
      cy.get('[contenteditable="true"]').type(newMessage);
      // Wait for the messages to be loaded before sending new message
      cy.get('[data-cy="message-group"]').should('be.visible');
      cy.get('[data-cy="chat-input-send-button"]').click();
      cy.contains('Sign in');
    });
  });

  describe('Public (authenticated)', () => {
    beforeEach(() => {
      cy.auth(author.id);
      cy.visit(`/thread/${thread.id}`);
    });

    it('should allow logged-in users to send public messages', () => {
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

  describe('Private', () => {
    beforeEach(() => {
      cy.auth(QUIET_USER_ID);
      cy.visit(`/thread/${privateThread.id}`);
    });

    it("should not allow logged-in users to send private messages if they don't have permission", () => {
      cy.get('[data-cy="null-thread-view"]').should('be.visible');
    });
  });

  describe('Private (with permissions)', () => {
    beforeEach(() => {
      cy.auth(privateAuthor.id);
      cy.visit(`/thread/${privateThread.id}`);
    });

    it('should allow logged-in users to send private messages if they have permission', () => {
      const newMessage = 'A new private message!';
      cy.get('[data-cy="thread-view"]').should('be.visible');
      cy.get('[contenteditable="true"]').type(newMessage);
      cy.get('[data-cy="chat-input-send-button"]').click();
      // Clear the chat input and make sure the message was sent by matching the text
      cy.get('[contenteditable="true"]').type('');
      cy.contains(newMessage);
    });
  });
});

describe('/new/thread', () => {
  beforeEach(() => {
    cy.auth(author.id);
    cy.visit('/new/thread');
  });

  it('should allow composing new threads', () => {
    const title = 'Some new thread';
    const body = "with some fresh content you've never seen before";
    cy.get('[data-cy="rich-text-editor"]').should('be.visible');
    cy.get('[data-cy="composer-community-selector"]').should('be.visible');
    cy.get('[data-cy="composer-channel-selector"]').should('be.visible');
    // Type title and body
    cy.get('[data-cy="composer-title-input"]').type(title);
    cy.get('[contenteditable="true"]').type(body);
    cy.get('[data-cy="composer-publish-button"]').click();
    cy.location('pathname').should('contain', 'thread');
    cy.get('[data-cy="thread-view"]');
    cy.contains(title);
    cy.contains(body);
  });
});
