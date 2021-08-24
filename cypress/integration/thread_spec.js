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
  });

  describe('Public (authenticated)', () => {
    beforeEach(() => {
      cy.auth(author.id).then(() => cy.visit(`/thread/${thread.id}`));
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
