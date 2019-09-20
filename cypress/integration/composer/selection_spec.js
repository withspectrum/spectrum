import data from '../../../shared/testing/data';
const user = data.users.find(user => user.username === 'brian');
const singleCommunityUser = data.users.find(
  user => user.username === 'single-community-user'
);

const publishButton = () => cy.get('[data-cy="composer-publish-button"]');
const cancelButton = () => cy.get('[data-cy="composer-cancel-button"]');

const publishButtonIsDisabled = () => {
  publishButton().should('be.visible');
  publishButton().should('be.disabled');
};

const publishButtonIsEnabled = () => {
  publishButton().should('be.visible');
  publishButton().should('not.be.disabled');
};

const communityDropdown = () =>
  cy.get('[data-cy="composer-community-selector"]');
const channelDropdown = () => cy.get('[data-cy="composer-channel-selector"]');
const communitySelected = () =>
  cy.get('[data-cy="composer-community-selected"]');
const channelSelected = () => cy.get('[data-cy="composer-channel-selected"]');

const communityDropdownIsEnabled = () => {
  communityDropdown().should('be.visible');
  communityDropdown().contains('Choose a community');
};

const channelDropdownIsHidden = () => {
  channelDropdown().should('not.be.visible');
};

const channelDropdownIsEnabled = () => {
  channelDropdown().should('be.visible');
  channelDropdown().contains('Choose a channel');
};

const communityIsLocked = () => {
  communitySelected().should('be.visible');
};

const channelIsLocked = () => {
  channelSelected().should('be.visible');
};

const openMobileCommunityMenu = () => {
  cy.get('[data-cy="community-menu-open"]')
    .first()
    .click();
};
const closeMobileCommunityMenu = () => {
  cy.get('[data-cy="community-menu-close"]')
    .first()
    .click('right', { force: true });
};

describe('/new/thread community and channel selection', () => {
  beforeEach(() => {
    cy.auth(user.id);
  });

  it('selects an only channel by default if no channel query param is passed', () => {
    cy.auth(singleCommunityUser.id);
    cy.visit('/new/thread?composerCommunityId=5');
    communityIsLocked();
    channelDropdownIsEnabled();
    channelDropdown().contains('# General');
  });

  it('selects an a single community and single channel by default if no query params are passed', () => {
    cy.auth(singleCommunityUser.id);
    cy.visit('/new/thread');
    communityDropdownIsEnabled();
    communityDropdown().contains('Single channel community');
    channelDropdownIsEnabled();
    channelDropdown().contains('# General');
  });

  it('does not select a community or channel if no query params are passed', () => {
    cy.visit('/new/thread');
    publishButtonIsDisabled();
    communityDropdownIsEnabled();
    channelDropdownIsHidden();
  });

  it('fetches channels when a community is selected', () => {
    cy.visit('/new/thread');
    communityDropdownIsEnabled();
    channelDropdownIsHidden();

    communityDropdown().select('Spectrum');
    channelDropdownIsEnabled();
    channelDropdown().contains('# General');
    channelDropdown().contains('# Private');

    communityDropdown().select('Payments');
    channelDropdown().contains('# General');
    channelDropdown().contains('# Private');
    channelDropdown().contains('# Payments Features');
  });

  it('keeps the publish button disabled if either community or channel selector is blank', () => {
    cy.visit('/new/thread');
    cy.get('[data-cy="composer-title-input"]').type('Foo');
    cy.get('[data-cy="rich-text-editor"]').type('Bar');
    publishButtonIsDisabled();

    communityDropdown().select('Spectrum');
    publishButtonIsDisabled();

    channelDropdownIsEnabled();
    channelDropdown().select('# General');
    publishButtonIsEnabled();

    communityDropdown().select('');
    channelDropdown().should('not.be.visible');
    publishButtonIsDisabled();

    communityDropdown().select('Spectrum');
    cy.wait(50);
    channelDropdown()
      .should('be.visible')
      .select('');
    cy.wait(50);
    publishButtonIsDisabled();

    channelDropdown().select('# General');
    publishButtonIsEnabled();
  });

  it('selects a community and prompts for a channel selection if a community param is passed', () => {
    cy.visit('/new/thread?composerCommunityId=1');
    communityIsLocked();
    channelDropdownIsEnabled();
  });

  it('does not select a community if a community param is passed and the user is not a member of the community', () => {
    cy.visit('/new/thread?composerCommunityId=4');
    communityDropdownIsEnabled();
  });

  it('does not select a community if a community param is passed and the community id is invalid', () => {
    cy.visit('/new/thread?composerCommunityId=abcdefg');
    communityDropdownIsEnabled();
  });

  it('does not select a community if a channel param is passed without a community param', () => {
    cy.visit('/new/thread?composerChannelId=1');
    communityDropdownIsEnabled();
    channelDropdownIsHidden();
  });

  it('selects a community and channel if both params are passed and the user is a member of both', () => {
    cy.visit('/new/thread?composerCommunityId=1&composerChannelId=1');
    communityIsLocked();
    communitySelected().contains('Spectrum');
    channelIsLocked();
    channelSelected().contains('General');
  });

  it('does not select a channel if a channel param is passed and the channel id is invalid', () => {
    cy.visit('/new/thread?composerCommunityId=1&composerChannelId=abcdefg');
    communityIsLocked();
    channelSelected().should('not.be.visible');
    channelDropdownIsEnabled();
  });

  it('does not select a community if both params are passed and the community id is invalid', () => {
    cy.visit(
      '/new/thread?composerCommunityId=abcdefg&composerChannelId=abcdefg'
    );
    communitySelected().should('not.be.visible');
    channelSelected().should('not.be.visible');
    communityDropdownIsEnabled();
    channelDropdownIsHidden();
  });

  it('does not select a community if both params are passed and the user is not a member of the community', () => {
    cy.visit('/new/thread?composerCommunityId=4&channelId=9');
    communityDropdownIsEnabled();
    channelDropdownIsHidden();
  });

  it('does not select a channel if a channel and community param are passed and the user is not a member of the channel', () => {
    cy.visit('/new/thread?composerCommunityId=1&channelId=6');
    communityIsLocked();
    channelDropdownIsEnabled();
  });
});
