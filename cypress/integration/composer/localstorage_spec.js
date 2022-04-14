import data from '../../../shared/testing/data';
const user = data.users.find(user => user.username === 'brian');
import constants from '../../../api/migrations/seed/default/constants';

const pressEscape = () =>
  cy
    .get('[data-cy="modal-container"]')
    .trigger('keydown', { keyCode: 27, force: true });
const pressEscapeMessageInput = () =>
  cy.get('[data-cy=editing-chat-input]').trigger('keydown', { keyCode: 27 });
const pressEnter = () =>
  cy.get('[data-cy="discard-draft-modal"]').trigger('keydown', { keyCode: 13 });
const discardDraftModal = () => cy.get('[data-cy="discard-draft-modal"]');
const cancelButton = () => cy.get('[data-cy="composer-cancel-button"]');
const title = 'Some new thread';
const body = "with some fresh content you've never seen before";
const message = 'new message';

const publicCommunity = data.communities.find(
  c => c.id === constants.SPECTRUM_COMMUNITY_ID
);

const publicChannel = data.channels.find(
  c => c.id === constants.SPECTRUM_GENERAL_CHANNEL_ID
);

const publicThread = data.threads.find(
  t => t.communityId === publicCommunity.id && t.channelId === publicChannel.id
);

const publicThreadAuthor = data.users.find(
  u => u.id === publicThread.creatorId
);

describe('composer content persistence', () => {
  beforeEach(() => {
    cy.auth(user.id).then(() => cy.visit('/spectrum'));
  });

  it('should persist content if the page is refreshed', () => {
    const title = 'Some new thread';
    const body = "with some fresh content you've never seen before";
    cy.get('[data-cy="community-view"]').should('be.visible');
    cy.get('[data-cy="navigation-composer"]')
      .should('be.visible')
      .click();
    cy.get('[data-cy="rich-text-editor"]').should('be.visible');
    cy.get('[data-cy="composer-community-selector"]')
      .should('be.visible')
      .select('Spectrum');
    cy.get('[data-cy="composer-channel-selector"]')
      .should('be.visible')
      .select('# General');

    // Type title and body
    cy.get('[data-cy="composer-title-input"]').type(title);
    cy.get('[data-cy="rich-text-editor"]').type(body);
    cy.wait(600); // greater than debounce value
    cy.reload();
    cy.get('[data-cy="rich-text-editor"]').should('be.visible');
    cy.get('[data-cy="composer-title-input"]').contains(title);
    cy.get('[data-cy="rich-text-editor"]').contains(body);
  });

  it('should not persist content in the composer after publish', () => {
    cy.get('[data-cy="navigation-composer"]')
      .should('be.visible')
      .click();
    cy.get('[data-cy="rich-text-editor"]').should('be.visible');
    cy.get('[data-cy="composer-community-selector"]')
      .should('be.visible')
      .select('Spectrum');
    cy.get('[data-cy="composer-channel-selector"]')
      .should('be.visible')
      .select('# General');

    // Type title and body
    cy.get('[data-cy="composer-title-input"]').type(title);
    cy.get('[data-cy="rich-text-editor"]').type(body);
    cy.get('[data-cy="composer-publish-button"]').click();
    cy.location('pathname').should('contain', 'thread');
    cy.get('[data-cy="thread-view"]');
    cy.contains(title);
    cy.contains(body);
    cy.visit('/new/thread');
    cy.get('[data-cy="composer-title-input"]').should('not.contain', title);
    cy.get('[data-cy="rich-text-editor"]').should('not.contain', body);
  });
});

describe('discarding drafts', () => {
  beforeEach(() => {
    cy.auth(user.id).then(() => cy.visit('/spectrum?tab=posts'));
    cy.get('[data-cy="navigation-composer"]')
      .should('be.visible')
      .click();
    cy.get('[data-cy="rich-text-editor"]').should('be.visible');
  });

  it('should not prompt to discard a draft if nothing has been typed', () => {
    pressEscape();
    cy.get('[data-cy="rich-text-editor"]').should('not.be.visible');
  });

  it('should prompt to discard draft if content has been typed', () => {
    cy.get('[data-cy="composer-title-input"]').type(title);
    cy.get('[data-cy="rich-text-editor"]').type(body);
    pressEscape();
    discardDraftModal().should('be.visible');
  });

  it('should prompt with cancel click', () => {
    cy.get('[data-cy="composer-title-input"]').type(title);
    cy.get('[data-cy="rich-text-editor"]').type(body);
    cancelButton().click();
    discardDraftModal().should('be.visible');
  });

  it('should prompt with overlay click', () => {
    cy.get('[data-cy="composer-title-input"]').type(title);
    cy.get('[data-cy="rich-text-editor"]').type(body);
    cy.get('[data-cy="overlay"]').click({ force: true });
    discardDraftModal().should('be.visible');
  });

  it('should not prompt if content is deleted midway through', () => {
    cy.get('[data-cy="composer-title-input"]').type(title);
    cy.get('[data-cy="rich-text-editor"]').type(body);
    cy.wait(600); // greater than debounce localstorage sync
    cy.get('[data-cy="composer-title-input"]').clear();
    cy.get('[data-cy="rich-text-editor"]').clear();
    cy.wait(600); // greater than debounce localstorage sync
    pressEscape();
    cy.get('[data-cy="rich-text-editor"]').should('not.be.visible');
  });

  it('should close discard confirmation modal on esc press', () => {
    cy.get('[data-cy="composer-title-input"]').type(title);
    cy.get('[data-cy="rich-text-editor"]').type(body);
    pressEscape();
    discardDraftModal().should('be.visible');
    discardDraftModal().trigger('keydown', { keyCode: 27, force: true });
    discardDraftModal().should('not.be.visible');
    cy.get('[data-cy="rich-text-editor"]').should('be.visible');
  });

  it('should close discard confirmation modal on cancel click', () => {
    cy.get('[data-cy="composer-title-input"]').type(title);
    cy.get('[data-cy="rich-text-editor"]').type(body);
    pressEscape();
    discardDraftModal().should('be.visible');
    cy.get('[data-cy="discard-draft-cancel"]').click();
    discardDraftModal().should('not.be.visible');
    cy.get('[data-cy="rich-text-editor"]').should('be.visible');
  });

  it('should discard draft on discard confirmation', () => {
    cy.get('[data-cy="composer-title-input"]').type(title);
    cy.get('[data-cy="rich-text-editor"]').type(body);
    cy.wait(600);
    pressEscape();
    discardDraftModal().should('be.visible');
    cy.get('[data-cy="discard-draft-discard"]').click();
    discardDraftModal().should('not.be.visible');
    cy.get('[data-cy="rich-text-editor"]').should('not.be.visible');
    cy.get('[data-cy="navigation-composer"]')
      .should('be.visible')
      .click();
    cy.get('[data-cy="rich-text-editor"]').should('be.visible');
    cy.get('[data-cy="composer-title-input"]').should('not.contain', title);
    cy.get('[data-cy="rich-text-editor"]').should('not.contain', body);
  });
});

describe('discarding drafts message', () => {
  beforeEach(() => {
    cy.auth(publicThreadAuthor.id).then(() =>
      cy.visit(`/thread/${publicThread.id}`)
    );

    cy.get('[data-cy="edit-message"]')
      .last()
      .click({ force: true });
  });

  it('should prompt with cancel click', () => {
    cy.get('[data-cy=editing-chat-input]').type(message);
    cy.get('[data-cy="edit-message-cancel"')
      .should('be.visible')
      .click();
    discardDraftModal().should('be.visible');
  });

  it('should prompt if esc pressed', () => {
    cy.get('[data-cy=editing-chat-input]').type(message);
    pressEscapeMessageInput();
    discardDraftModal().should('be.visible');
  });

  it('should not prompt to discard message draft if nothing has been changed', () => {
    cy.get('[data-cy="edit-message-cancel"')
      .should('be.visible')
      .click();
    discardDraftModal().should('not.be.visible');
  });

  it('should close discard confirmation modal on esc press', () => {
    cy.get('[data-cy=editing-chat-input]').type(message);
    pressEscapeMessageInput();
    discardDraftModal().should('be.visible');
    discardDraftModal().trigger('keydown', { keyCode: 27, force: true });
    discardDraftModal().should('not.be.visible');
    cy.get('[data-cy=editing-chat-input]').should('be.visible');
  });

  it('should discard draft on confirmation when ENTER pressed', () => {
    cy.get('[data-cy=editing-chat-input]').type(message);
    pressEscapeMessageInput();
    discardDraftModal().should('be.visible');
    pressEnter();
    discardDraftModal().should('not.be.visible');
    cy.get('[data-cy="message"]')
      .last()
      .should('not.contain', message);
  });

  it('should discard draft on discard confirmation', () => {
    cy.get('[data-cy=editing-chat-input]').type(message);
    pressEscapeMessageInput();
    discardDraftModal().should('be.visible');
    cy.get('[data-cy="discard-draft-discard"]').click();
    discardDraftModal().should('not.be.visible');
    cy.get('[data-cy="message"]')
      .last()
      .should('not.contain', message);
  });
});
