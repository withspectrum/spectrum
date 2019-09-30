import data from '../../../shared/testing/data';
const usersChannels = data.usersChannels;
const brian = data.users.find(user => user.username === 'brian');
const max = data.users.find(user => user.username === 'mxstbr');
const community = data.communities[0];
const channels = data.channels
  .filter(channel => channel.communityId === community.id)
  .filter(channel => !channel.archivedAt)
  .filter(channel => !channel.deletedAt);
const channelsWhereBrianIsMember = usersChannels
  .filter(uc => uc.userId === brian.id)
  .filter(uc => channels.some(channel => channel.id === uc.channelId))
  .filter(uc => uc.isMember)
  .map(uc => channels.find(channel => channel.id === uc.channelId));

const communityViewLoaded = () =>
  cy.get('[data-cy="community-view"]').should('be.visible');
const channelViewLoaded = () =>
  cy.get('[data-cy="channel-view"]').should('be.visible');
const miniComposerExpanded = () => cy.get('[data-cy="mini-composer-expanded"]');
const miniComposerCollapsed = () =>
  cy.get('[data-cy="mini-composer-collapsed"]');
const openMiniComposer = () => miniComposerCollapsed().click();
const miniComposerWarning = () => cy.get('[data-cy="mini-composer-warning"]');
const miniComposerTitle = () => cy.get('[data-cy="mini-composer-title"]');
const miniComposerBody = () => cy.get('[data-cy="mini-composer-body"]');
const miniComposerCancel = () => cy.get('[data-cy="mini-composer-cancel"]');
const miniComposerPost = () => cy.get('[data-cy="mini-composer-post"]');
const miniComposerFullscreen = () =>
  cy.get('[data-cy="mini-composer-fullscreen"]');
const channelDropdown = () => cy.get('[data-cy="composer-channel-selector"]');

describe('mini composer visibility', () => {
  it('does not appear for signed out users', () => {
    cy.visit('/spectrum?tab=posts');
    communityViewLoaded();
    miniComposerCollapsed().should('not.be.visible');
  });

  it('does not appear for archived channels', () => {
    cy.auth(brian.id);
    cy.visit('/spectrum/archived?tab=posts');
    channelViewLoaded();
    miniComposerCollapsed().should('not.be.visible');
  });

  it('does not appear in communities where user is not a member', () => {
    cy.auth(max.id);
    cy.visit('/single?tab=posts');
    communityViewLoaded();
    miniComposerCollapsed().should('not.be.visible');
  });

  it('does not appear in channels where user is not a member', () => {
    cy.auth(max.id);
    cy.visit('/spectrum/moderator-created?tab=posts');
    channelViewLoaded();
    miniComposerCollapsed().should('not.be.visible');
  });

  it('does appear on community view', () => {
    cy.auth(brian.id);
    cy.visit('/spectrum?tab=posts');
    communityViewLoaded();
    miniComposerCollapsed().should('be.visible');
  });

  it('does appear on channel view', () => {
    cy.auth(brian.id);
    cy.visit('/spectrum/general?tab=posts');
    channelViewLoaded();
    miniComposerCollapsed().should('be.visible');
  });

  it('does not render on mobile', () => {
    cy.viewport('iphone-6');
    cy.auth(brian.id);
    cy.visit('/spectrum?tab=posts');
    communityViewLoaded();
    miniComposerCollapsed().should('not.be.visible');
  });
});

describe('mini composer functionality', () => {
  it('should warn if titles are too long', () => {
    cy.auth(brian.id);
    cy.visit('/spectrum/general?tab=posts');
    channelViewLoaded();
    miniComposerCollapsed().should('be.visible');
    openMiniComposer();
    miniComposerTitle().type(
      'this is a long title that should exceed the maximumum length suggested for a post title to be gosh dang'
    );
    miniComposerWarning().should('be.visible');
    miniComposerTitle().clear();
    miniComposerWarning().should('not.be.visible');
  });

  const title = 'this is a title';
  const body = 'this is a body';

  it('should persist drafts between page loads', () => {
    cy.auth(brian.id);
    cy.visit('/spectrum/general?tab=posts');
    channelViewLoaded();
    miniComposerCollapsed().should('be.visible');
    openMiniComposer();
    miniComposerTitle().type(title);
    miniComposerBody()
      .click()
      .type(body);
    cy.wait(500);
    cy.reload();
    channelViewLoaded();
    miniComposerExpanded().should('be.visible');
    miniComposerTitle().should('have.value', title);
    miniComposerBody().should('have.value', body);
  });

  it('should persist drafts in fullscreen mode', () => {
    cy.auth(brian.id);
    cy.visit('/spectrum/general?tab=posts');
    channelViewLoaded();
    miniComposerCollapsed().should('be.visible');
    openMiniComposer();
    miniComposerTitle().type(title);
    miniComposerBody()
      .click()
      .type(body);
    miniComposerFullscreen().click();
    cy.get('[data-cy="thread-composer-wrapper"]').should('be.visible');
    cy.get('[data-cy="thread-composer-wrapper"]').contains(title);
    cy.get('[data-cy="thread-composer-wrapper"]').contains(body);
  });

  it.skip('should persist drafts when closing fullscreen mode', () => {
    cy.auth(brian.id);
    cy.visit('/spectrum/general?tab=posts');
    channelViewLoaded();
    miniComposerCollapsed().should('be.visible');
    openMiniComposer();
    miniComposerTitle().type(title);
    miniComposerBody()
      .click()
      .type(body);
    miniComposerFullscreen().click();
    channelViewLoaded();
    cy.get('[data-cy="thread-composer-wrapper"]').should('be.visible');
    cy.get('[data-cy="thread-composer-wrapper"]').contains(title);
    cy.get('[data-cy="thread-composer-wrapper"]').contains(body);
    cy.get('[data-cy="composer-title-input"]').type('foo');
    cy.get('[data-cy="rich-text-editor"]').type('bar');
    cy.wait(1000);
    cy.get('[data-cy="composer-cancel-button"]').click();
    miniComposerExpanded().scrollIntoView();
    miniComposerTitle()
      .scrollIntoView()
      .should('not.have.value', title);
    miniComposerBody().should('not.have.value', body);
  });

  it('should handle post button disabled state on community view', () => {
    cy.auth(brian.id);
    cy.visit('/spectrum?tab=posts');
    communityViewLoaded();
    miniComposerCollapsed().should('be.visible');
    openMiniComposer();
    miniComposerPost().should('be.disabled');
    miniComposerTitle().type(title);
    miniComposerPost().should('be.disabled');
    miniComposerBody()
      .click()
      .type(body);
    miniComposerPost().should('be.disabled');
    channelDropdown().contains('Choose a channel');
    channelDropdown().select('# General');
    miniComposerPost().should('not.be.disabled');
  });

  it('should handle post button disabled state on channel view', () => {
    cy.auth(brian.id);
    cy.visit('/spectrum/general?tab=posts');
    channelViewLoaded();
    miniComposerCollapsed().should('be.visible');
    openMiniComposer();
    miniComposerPost().should('be.disabled');
    miniComposerTitle().type(title);
    miniComposerPost().should('not.be.disabled');
    channelDropdown().should('be.visible');
    channelDropdown().should('be.disabled');
    miniComposerTitle().clear();
    miniComposerBody().type(body);
    miniComposerPost().should('be.disabled');
  });

  it('should open thread in modal after publish', () => {
    cy.auth(brian.id);
    cy.visit('/spectrum?tab=posts');
    communityViewLoaded();
    miniComposerCollapsed()
      .scrollIntoView()
      .should('be.visible');
    openMiniComposer();
    miniComposerPost().should('be.disabled');
    miniComposerTitle().type(title);
    miniComposerPost().should('be.disabled');
    miniComposerBody()
      .click()
      .type(body);
    miniComposerPost().should('be.disabled');
    channelDropdown().contains('Choose a channel');
    channelDropdown().select('# General');
    miniComposerPost().should('not.be.disabled');
    miniComposerPost().click();
    cy.get('[data-cy="thread-view"]').should('be.visible');

    // it should clear the draft state post publish
    cy.visit('/spectrum?tab=posts');
    miniComposerCollapsed()
      .scrollIntoView()
      .should('be.visible');
    openMiniComposer();
    miniComposerTitle().should('not.have.value', title);
    miniComposerBody().should('not.have.value', body);
  });

  it('should cancel the mini composer', () => {
    cy.auth(brian.id);
    cy.visit('/spectrum?tab=posts');
    communityViewLoaded();
    miniComposerCollapsed()
      .scrollIntoView()
      .should('be.visible');
    openMiniComposer();
    miniComposerExpanded()
      .scrollIntoView()
      .should('be.visible');
    miniComposerCancel().click();
    miniComposerCollapsed()
      .scrollIntoView()
      .should('be.visible');
  });

  it('should fetch channels for the channel dropdown', () => {
    cy.auth(brian.id);
    cy.visit('/spectrum?tab=posts');
    communityViewLoaded();
    miniComposerCollapsed()
      .scrollIntoView()
      .should('be.visible');
    openMiniComposer();
    channelsWhereBrianIsMember.map(channel => {
      channelDropdown().contains(channel.name);
    });
  });
});
