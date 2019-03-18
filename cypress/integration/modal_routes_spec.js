import data from '../../shared/testing/data';
const user = data.users.find(user => user.username === 'brian');

const pressEscape = () => cy.get('body').trigger('keydown', { keyCode: 27 });

const communityBeforeUrlIsValid = () =>
  cy.url().should('eq', 'http://localhost:3000/spectrum?tab=posts');
const channelBeforeUrlIsValid = () =>
  cy.url().should('eq', 'http://localhost:3000/spectrum/general?tab=posts');

describe('composer modal route', () => {
  beforeEach(() => {
    cy.auth(user.id);
  });

  const threadComposerWrapper = () =>
    cy.get('[data-cy="thread-composer-wrapper"]');
  const threadComposer = () => cy.get('[data-cy="thread-composer"]');
  const communityComposerPlaceholder = () =>
    cy.get('[data-cy="community-thread-compose-button"]');
  const channelComposerPlaceholder = () =>
    cy.get('[data-cy="channel-thread-compose-button"]');

  it('handles community view', () => {
    cy.visit('/spectrum');
    communityBeforeUrlIsValid();
    communityComposerPlaceholder().click();
    threadComposer().should('be.visible');
    threadComposerWrapper().should('be.visible');
    cy.url().should(
      'eq',
      'http://localhost:3000/new/thread?composerCommunityId=1'
    );

    pressEscape();

    threadComposer().should('not.be.visible');
    threadComposerWrapper().should('not.be.visible');
    communityBeforeUrlIsValid();
  });

  it('handles channel view', () => {
    cy.visit('/spectrum/general');
    channelBeforeUrlIsValid();
    channelComposerPlaceholder().click();
    threadComposer().should('be.visible');
    threadComposerWrapper().should('be.visible');
    cy.url().should(
      'eq',
      'http://localhost:3000/new/thread?composerChannelId=1&composerCommunityId=1'
    );

    pressEscape();

    threadComposer().should('not.be.visible');
    threadComposerWrapper().should('not.be.visible');
    channelBeforeUrlIsValid();
  });
});
