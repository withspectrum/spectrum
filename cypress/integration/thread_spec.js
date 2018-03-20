import { toPlainText, toState } from '../../shared/draft-utils';
import data from '../../shared/testing/data';

const thread = data.threads[0];
const channel = data.channels.find(channel => channel.id === thread.channelId);
const community = data.communities.find(
  community => community.id === thread.communityId
);
const author = data.users.find(user => user.id === thread.creatorId);
const messages = data.messages.filter(
  message => message.threadId === thread.id
);

describe('Thread View', () => {
  // Before every test suite set up a new browser and page
  before(() => {
    cy.visit(`/thread/${thread.id}`);
  });

  it('should render', () => {
    cy.get('[data-e2e-id="thread-view"]').should('be.visible');
    cy.contains(thread.content.title);
    cy.contains(
      toPlainText(toState(JSON.parse(thread.content.body))).split(' ')[0]
    );
    cy.contains(author.name);
    cy.contains(author.username);
    cy.get(`[href*="/users/${author.username}"]`).should('be.visible');
    cy.get(`[href*="/${community.slug}"]`).should('be.visible');

    cy.get('[data-e2e-id="message-group"]').should('be.visible');
    messages.forEach(message => {
      cy.contains(toPlainText(toState(JSON.parse(message.content.body))));
    });
  });
});

describe.only('/new/thread', () => {
  beforeEach(() => {
    cy.auth(author.id);
    cy.visit('/new/thread');
  });

  it('should allow composing new threads', () => {
    const title = 'Some new thread';
    const body = "with some fresh content you've never seen before";
    cy.get('[data-e2e-id="rich-text-editor"]').should('be.visible');
    cy.get('[data-e2e-id="composer-community-selector"]').should('be.visible');
    cy.get('[data-e2e-id="composer-channel-selector"]').should('be.visible');
    // Type title and body
    cy
      .get('[data-e2e-id="composer-title-input"]')
      .should('be.visible')
      .type(title);
    // TODO: Cypress doesn't handle DraftJS very well, it only inlcudes the first character
    //cy.get('[contenteditable="true"]').type(body)
    cy.get('[data-e2e-id="composer-publish-button"]').click();
    cy.location('pathname').should('contain', 'thread');
    cy.get('[data-e2e-id="thread-view"]');
    cy.contains(title);
  });
});
