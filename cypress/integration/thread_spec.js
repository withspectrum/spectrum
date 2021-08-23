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
const moderator = data.usersCommunities
  .filter(usersCommunity => usersCommunity.communityId === community.id)
  .find(usersCommunity => usersCommunity.isOwner);
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
      cy.get('[data-cy="thread-view"]').should('be.visible');
      cy.get('[data-cy="join-community-chat-upsell"]').should('be.visible');
      cy.get('[data-cy="join-community-chat-upsell"]').click();
      cy.get('[data-cy="login-modal"]').should('be.visible');
    });
  });

  describe('Public (authenticated)', () => {
    beforeEach(() => {
      cy.auth(author.id).then(() => cy.visit(`/thread/${thread.id}`));
    });

    it('should allow logged-in users to send public messages', () => {
      const newMessage = 'A new message!';
      cy.get('[data-cy="thread-view"]').should('be.visible');
      cy.get('[data-cy="chat-input"]').type(newMessage);
      // Wait for the messages to be loaded before sending new message
      cy.get('[data-cy="message-group"]').should('be.visible');
      cy.get('[data-cy="chat-input-send-button"]').click();
      // Clear the chat input and make sure the message was sent by matching the text
      cy.get('[data-cy="chat-input"]').clear();
      cy.contains(newMessage);
    });
  });

  describe('Private', () => {
    beforeEach(() => {
      cy.auth(QUIET_USER_ID).then(() =>
        cy.visit(`/thread/${privateThread.id}`)
      );
    });

    it("should not allow logged-in users to send private messages if they don't have permission", () => {
      cy.get('[data-cy="null-thread-view"]').should('be.visible');
    });
  });

  describe('Private (with permissions)', () => {
    beforeEach(() => {
      cy.auth(privateAuthor.id).then(() =>
        cy.visit(`/thread/${privateThread.id}`)
      );
    });

    it('should allow logged-in users to send private messages if they have permission', () => {
      const newMessage = 'A new private message!';
      cy.get('[data-cy="thread-view"]').should('be.visible');
      cy.get('[data-cy="chat-input"]').type(newMessage);
      cy.get('[data-cy="chat-input-send-button"]').click();
      // Clear the chat input and make sure the message was sent by matching the text
      cy.get('[data-cy="chat-input"]').clear();
      cy.contains(newMessage);
    });
  });

  describe('Loading a thread with a message query parameter', () => {
    beforeEach(() => {
      cy.auth(author.id).then(() =>
        cy.visit(`/thread/thread-1?m=MTQ4MzIyNTIwMDAwMQ==`)
      );
    });

    it('should load only messages after the selected message', () => {
      cy.get('[data-cy="thread-view"]').should('be.visible');
      // ensure messages have loaded
      cy.contains('This is the first message!').should('not.be.visible');

      // the first message should be selected
      cy.get('[data-cy="message-selected"]').should('be.visible');

      // only one message should be selected
      cy.get('[data-cy="message-selected"]').should($p => {
        expect($p).to.have.length(1);
      });

      // the other messages should be unselected
      cy.get('[data-cy="message"]').should($p => {
        expect($p).to.have.length(3);
      });
    });
  });

  describe('copy link to message', () => {
    beforeEach(() => {
      cy.auth(author.id).then(() => cy.visit(`/thread/${thread.id}`));
    });

    it('should copy link to message from message actions', () => {
      cy.get('[data-cy="thread-view"]').should('be.visible');
      // ensure messages have loaded
      cy.contains('This is the first message!').should('be.visible');

      // click the copy link icon on the first message
      cy.get('[data-cy="link-to-message"]')
        .first()
        .should('be.visible')
        .click({ force: true });
    });
  });

  describe('message timestamp', () => {
    beforeEach(() => {
      cy.auth(author.id).then(() => cy.visit(`/thread/${thread.id}`));
    });

    it('should link the thread with message query param', () => {
      cy.get('[data-cy="thread-view"]').should('be.visible');
      // ensure messages have loaded
      cy.contains('This is the first message!').should('be.visible');

      // click the copy link icon on the first message
      cy.get('[data-cy="message-timestamp"]')
        .first()
        .should('be.visible')
        .click({ force: true });

      cy.url().should('contain', `?m=MTQ4MzIyNTE5OTk5OQ==`);
    });
  });

  describe('liking a message signed in', () => {
    beforeEach(() => {
      cy.auth(author.id).then(() => cy.visit(`/thread/${thread.id}`));
    });

    it('should like a message from the message action bar', () => {
      cy.get('[data-cy="thread-view"]').should('be.visible');
      // ensure messages have loaded
      cy.contains('This is the first message!').should('be.visible');
      // the message should not be selected
      cy.get('[data-cy="message-selected"]').should('not.be.visible');
      // the url should not have changed
      cy.url().should('not.contain', `?m`);
      // the url should not have changed
      cy.url().should('not.contain', `?m`);
    });
  });

  describe('like a message signed out', () => {
    beforeEach(() => {
      cy.visit(`/thread/${thread.id}`);
    });

    it('should prompt login for non users on inline reaction', () => {
      cy.get('[data-cy="thread-view"]').should('be.visible');
      // ensure messages have loaded
      cy.contains('This is the first message!').should('be.visible');

      // click the first like action in the message action bar
      cy.get('[data-cy="inline-like-action"]')
        .scrollIntoView()
        .should('be.visible')
        .click({ force: true });
      // login modal should appear
      cy.get('[data-cy="login-modal"]').should('be.visible');
    });

    it('should prompt login for non users on like action bar', () => {
      cy.get('[data-cy="thread-view"]').should('be.visible');
      // ensure messages have loaded
      cy.contains('This is the first message!').should('be.visible');

      // click the first like action in the message action bar
      cy.get('[data-cy="like-action"]')
        .first()
        .should('be.visible')
        .click({ force: true });
      // login modal should appear
      cy.get('[data-cy="login-modal"]').should('be.visible');
    });
  });

  describe('delete message as message author', () => {
    beforeEach(() => {
      cy.auth(author.id).then(() => cy.visit(`/thread/${thread.id}`));
    });

    it('should allow a user to delete their own message', () => {
      // the last message should have delete action in the message action bar
      cy.get('[data-cy="delete-message"]').should('be.visible');
      // there should only be one deletable message
      cy.get('[data-cy="delete-message"]').should($p => {
        expect($p).to.have.length(1);
      });
      // clicking delete message should open double check modal
      cy.get('[data-cy="delete-message"]')
        .last()
        .click({ force: true });
      // modal should open
      cy.get('[data-cy="delete-button"]').should('be.visible');
    });
  });

  describe('delete message as community moderator', () => {
    beforeEach(() => {
      cy.auth(moderator.userId).then(() => cy.visit(`/thread/${thread.id}`));
    });

    it('should allow a user to delete all messages', () => {
      // the last message should have delete action in the message action bar
      cy.get('[data-cy="delete-message"]').should('be.visible');
      // there should only be one deletable message
      cy.get('[data-cy="delete-message"]').should($p => {
        expect($p).to.have.length(4);
      });
      // clicking delete message should open double check modal
      cy.get('[data-cy="delete-message"]')
        .last()
        .click({ force: true });
      // modal should open
      cy.get('[data-cy="delete-button"]').should('be.visible');
    });
  });
});

describe('edit message signed out', () => {
  beforeEach(() => {
    cy.visit(`/thread/${thread.id}`);
  });

  it('should not render edit message buttons', () => {
    cy.get('[data-cy="edit-message"]').should('not.be.visible');
  });
});

describe('edit message signed in', () => {
  beforeEach(() => {
    cy.auth(moderator.userId).then(() => cy.visit(`/thread/${thread.id}`));
  });

  it('should render edit buttons on current users messages', () => {
    cy.get('[data-cy="edit-message"]').should('be.visible');
    cy.get('[data-cy="edit-message"]').should($p => {
      expect($p).to.have.length(2);
    });
    cy.contains('The next one is an emoji-only one :scream:')
      .scrollIntoView()
      .should('be.visible');

    cy.get('[data-cy="edit-message"]')
      .last()
      .click({ force: true });

    cy.get('[data-cy="edit-message-input"]')
      .scrollIntoView()
      .should('be.visible');

    cy.get('[data-cy="edit-message-cancel"]')
      .scrollIntoView()
      .should('be.visible');

    cy.get('[data-cy="edit-message-save"]')
      .scrollIntoView()
      .should('be.visible');

    cy.get('[data-cy="edit-message-cancel"]')
      .scrollIntoView()
      .should('be.visible')
      .click();

    cy.get('[data-cy="edit-message-input"]').should('not.be.visible');

    cy.get('[data-cy="edit-message-cancel"]').should('not.be.visible');
    cy.get('[data-cy="edit-message-save"]').should('not.be.visible');

    cy.get('[data-cy="edit-message"]')
      .last()
      .click({ force: true });

    cy.get('[data-cy="edit-message-input"]');
    cy.get('[data-cy="editing-chat-input"]').type(' with edits');

    cy.get('[data-cy="edit-message-save"]').click();

    cy.get('[data-cy="edit-message-input"]').should('not.be.visible');

    cy.get('[data-cy="edited-message-indicator"]').should('be.visible');
    cy.contains('The next one is an emoji-only one :scream: with edits')
      .scrollIntoView()
      .should('be.visible');
  });
});
