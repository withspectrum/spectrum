import data from '../../shared/testing/data';
const user = data.users.find(user => user.username === 'brian');

const pressEscape = () => cy.get('body').trigger('keydown', { keyCode: 27 });

const inboxBeforeUrlIsValid = () =>
  cy.url().should('eq', 'http://localhost:3000/?t=thread-9');
const communityBeforeUrlIsValid = () =>
  cy.url().should('eq', 'http://localhost:3000/spectrum');
const channelBeforeUrlIsValid = () =>
  cy.url().should('eq', 'http://localhost:3000/spectrum/general');

describe('composer modal route', () => {
  beforeEach(() => {
    cy.auth(user.id);
  });

  const threadComposerWrapper = () =>
    cy.get('[data-cy="thread-composer-wrapper"]');
  const threadComposerOverlay = () =>
    cy.get('[data-cy="thread-composer-overlay"]');
  const threadSliderOverlay = () => cy.get('[data-cy="thread-slider-overlay"]');
  const cancelThreadComposer = () =>
    cy.get('[data-cy="composer-cancel-button"]').click();
  const threadComposer = () => cy.get('[data-cy="thread-composer"]');
  const composerPlaceholder = () =>
    cy.get('[data-cy="thread-composer-placeholder"]');
  const inboxComposeButton = () => cy.get('[data-cy="inbox-view-post-button"]');

  it('handles esc key', () => {
    cy.visit('/');
    cy.get('[data-cy="inbox-thread-feed"]').should('be.visible');
    inboxBeforeUrlIsValid();
    inboxComposeButton().should('be.visible');
    inboxComposeButton().click();
    threadComposer().should('be.visible');
    threadComposerWrapper().should('be.visible');
    cy.url().should('eq', 'http://localhost:3000/new/thread');

    pressEscape();

    threadComposer().should('not.be.visible');
    threadComposerWrapper().should('not.be.visible');
    inboxBeforeUrlIsValid();
  });

  it('handles overlay click', () => {
    cy.visit('/');
    cy.get('[data-cy="inbox-thread-feed"]').should('be.visible');
    inboxBeforeUrlIsValid();
    inboxComposeButton().should('be.visible');
    inboxComposeButton().click();
    threadComposer().should('be.visible');
    threadComposerWrapper().should('be.visible');
    cy.url().should('eq', 'http://localhost:3000/new/thread');

    threadComposerWrapper().click(200, 200);

    threadComposer().should('not.be.visible');
    threadComposerWrapper().should('not.be.visible');
    inboxBeforeUrlIsValid();
  });

  it('handles cancel click', () => {
    cy.visit('/');
    cy.get('[data-cy="inbox-thread-feed"]').should('be.visible');
    inboxBeforeUrlIsValid();
    inboxComposeButton().should('be.visible');
    inboxComposeButton().click();
    threadComposer().should('be.visible');
    threadComposerWrapper().should('be.visible');
    cy.url().should('eq', 'http://localhost:3000/new/thread');

    cancelThreadComposer();

    threadComposer().should('not.be.visible');
    threadComposerWrapper().should('not.be.visible');
    inboxBeforeUrlIsValid();
  });

  it('handles community view', () => {
    cy.visit('/spectrum');
    communityBeforeUrlIsValid();
    composerPlaceholder().click();
    threadComposer().should('be.visible');
    threadComposerWrapper().should('be.visible');
    cy.url().should('eq', 'http://localhost:3000/new/thread?communityId=1');

    pressEscape();

    threadComposer().should('not.be.visible');
    threadComposerWrapper().should('not.be.visible');
    communityBeforeUrlIsValid();
  });

  it('handles channel view', () => {
    cy.visit('/spectrum/general');
    channelBeforeUrlIsValid();
    composerPlaceholder().click();
    threadComposer().should('be.visible');
    threadComposerWrapper().should('be.visible');
    cy.url().should(
      'eq',
      'http://localhost:3000/new/thread?channelId=1&communityId=1'
    );

    pressEscape();

    threadComposer().should('not.be.visible');
    threadComposerWrapper().should('not.be.visible');
    channelBeforeUrlIsValid();
  });
});

describe('thread modal route', () => {
  const threadSlider = () => cy.get('[data-cy="thread-slider"]');
  const threadSliderClose = () => cy.get('[data-cy="thread-slider-close"]');

  it('handles esc key', () => {
    cy.visit('/spectrum');
    cy.get('[data-cy="thread-card"]')
      .first()
      .click();
    threadSlider().should('be.visible');
    cy.url(
      'eq',
      'http://localhost:3000/spectrum/private/yet-another-thread~thread-6'
    );

    pressEscape();

    communityBeforeUrlIsValid();
    threadSlider().should('not.be.visible');
  });

  it('handles overlay click', () => {
    cy.visit('/spectrum');
    cy.get('[data-cy="thread-card"]')
      .first()
      .click();
    threadSlider().should('be.visible');
    cy.url(
      'eq',
      'http://localhost:3000/spectrum/private/yet-another-thread~thread-6'
    );

    cy.get('body').click(200, 200);

    communityBeforeUrlIsValid();
    threadSlider().should('not.be.visible');
  });

  it('handles close click', () => {
    cy.visit('/spectrum');
    cy.get('[data-cy="thread-card"]')
      .first()
      .click();
    threadSlider().should('be.visible');
    cy.url(
      'eq',
      'http://localhost:3000/spectrum/private/yet-another-thread~thread-6'
    );

    threadSliderClose().click();

    communityBeforeUrlIsValid();
    threadSlider().should('not.be.visible');
  });

  it('handles channel feed', () => {
    cy.visit('/spectrum/general');
    cy.get('[data-cy="thread-card"]')
      .first()
      .click();
    threadSlider().should('be.visible');
    cy.url(
      'eq',
      'http://localhost:3000/spectrum/spectrum/general/yet-another-thread~thread-9'
    );

    pressEscape();

    channelBeforeUrlIsValid();
    threadSlider().should('not.be.visible');
  });

  it('handles inbox feed', () => {
    cy.auth(user.id);
    cy.visit('/');
    cy.get('[data-cy="inbox-thread-feed"]').should('be.visible');
    cy.wait(500);
    cy.get('[data-cy="thread-card"]')
      .eq(1)
      .click();
    threadSlider().should('not.be.visible');
  });

  it.only('handles thread attachment', () => {
    cy.auth(user.id);
    cy.visit('/spectrum/private/yet-another-thread~thread-6');
    cy.get('[data-cy="thread-attachment"]')
      .should('be.visible')
      .first()
      .click();
    threadSlider().should('be.visible');
  });
});
