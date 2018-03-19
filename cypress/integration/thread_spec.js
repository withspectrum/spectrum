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
