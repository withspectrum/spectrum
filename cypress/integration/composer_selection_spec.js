import data from '../../shared/testing/data';
const user = data.users.find(user => user.username === 'brian');

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
const inboxComposeButton = () => cy.get('[data-cy="inbox-view-post-button"]');
const everythingFilter = () =>
  cy.get('[data-cy="inbox-community-list-item"]').first();
const firstCommunityFilter = () =>
  cy.get('[data-cy="inbox-community-list-item"]').eq(1);
const secondCommunityFilter = () =>
  cy.get('[data-cy="inbox-community-list-item"]').eq(2);
const inboxChannelFilter = () =>
  cy.get('[data-cy="inbox-channel-list-item"]').first();
const secondInboxChannelFilter = () =>
  cy.get('[data-cy="inbox-channel-list-item"]').eq(1);
const composerPlaceholder = () =>
  cy.get('[data-cy="thread-composer-placeholder"]');
const titlebarComposeButton = () =>
  cy.get('[data-cy="titlebar-compose-button"]');

const communityDropdownIsEnabled = () => {
  communityDropdown().should('be.visible');
  communityDropdown().contains('Choose a community');
  communityDropdown().contains('Spectrum');
  communityDropdown().contains('Payments');
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

  it.only('selects an only channel by default if no channel query param is passed', () => {
    cy.visit('/new/thread?composerCommunityId=5');
    communityIsLocked();
    channelDropdownIsEnabled();
    channelDropdown().contains('General');
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
    channelDropdown().contains('General');
    channelDropdown().contains('Private');

    communityDropdown().select('Payments');
    channelDropdown().contains('General');
    channelDropdown().contains('Private');
    channelDropdown().contains('Payments Features');
  });

  it('keeps the publish button disabled if either community or channel selector is blank', () => {
    cy.visit('/new/thread');
    cy.get('[data-cy="composer-title-input"]').type('Foo');
    cy.get('[data-cy="rich-text-editor"]').type('Bar');
    publishButtonIsDisabled();

    communityDropdown().select('Spectrum');
    publishButtonIsDisabled();

    channelDropdownIsEnabled();
    channelDropdown().select('General');
    publishButtonIsEnabled();

    communityDropdown().select('');
    publishButtonIsDisabled();

    communityDropdown().select('Spectrum');
    channelDropdown().select('');
    publishButtonIsDisabled();

    channelDropdown().select('General');
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

describe('community view composer', () => {
  beforeEach(() => {
    cy.auth(user.id);
  });

  it('should lock the community selection', () => {
    cy.visit('/spectrum');
    composerPlaceholder()
      .should('be.visible')
      .click();
    communityIsLocked();
    channelDropdownIsEnabled();
    channelDropdown().contains('General');
    channelDropdown().contains('Private');
  });
});

describe('channel view composer', () => {
  beforeEach(() => {
    cy.auth(user.id);
  });

  it('should lock the community and channel selection', () => {
    cy.visit('/spectrum/general');
    composerPlaceholder()
      .should('be.visible')
      .click();
    communityIsLocked();
    channelIsLocked();
    communitySelected().contains('Spectrum');
    channelSelected().contains('General');
  });
});

describe('inbox composer', () => {
  beforeEach(() => {
    cy.auth(user.id).then(() => cy.visit('/'));
  });

  it('does not select a community or channel if the composer is opened from the everything feed', () => {
    cy.get('[data-cy="inbox-thread-feed"]').should('be.visible');
    inboxComposeButton().should('be.visible');
    inboxComposeButton().click();
    communityDropdownIsEnabled();
    channelDropdownIsHidden();
  });

  it('selects a community if the composer is opened from a community filter', () => {
    cy.get('[data-cy="inbox-thread-feed"]').should('be.visible');
    firstCommunityFilter().click();
    cy.get('[data-cy="inbox-thread-feed"]').should('be.visible');
    inboxComposeButton().should('be.visible');
    inboxComposeButton().click();
    communityIsLocked();
    communitySelected().contains('Spectrum');
    channelDropdownIsEnabled();
  });

  it('selects both a community and channel if the composer is opened from a channel filter', () => {
    cy.get('[data-cy="inbox-thread-feed"]').should('be.visible');
    firstCommunityFilter().click();
    inboxChannelFilter().click();
    inboxComposeButton().should('be.visible');
    inboxComposeButton().click();
    communityIsLocked();
    communitySelected().contains('Spectrum');
    channelIsLocked();
    channelSelected().contains('General');
  });

  it('updates the community selection in the composer if the community is switched', () => {
    cy.get('[data-cy="inbox-thread-feed"]').should('be.visible');
    firstCommunityFilter().click();
    cy.get('[data-cy="inbox-thread-feed"]').should('be.visible');
    inboxComposeButton().should('be.visible');
    inboxComposeButton().click();
    communityIsLocked();
    communitySelected().contains('Spectrum');
    channelDropdownIsEnabled();

    cancelButton().click();

    secondCommunityFilter().click();
    cy.get('[data-cy="inbox-thread-feed"]').should('be.visible');
    inboxComposeButton().should('be.visible');
    inboxComposeButton().click();
    communityIsLocked();
    communitySelected().contains('Payments');
    channelDropdownIsEnabled();
  });

  it('updates the channel selection in the composer if the channel is switched', () => {
    cy.get('[data-cy="inbox-thread-feed"]').should('be.visible');
    firstCommunityFilter().click();
    cy.get('[data-cy="inbox-thread-feed"]').should('be.visible');
    inboxChannelFilter().click();
    cy.get('[data-cy="inbox-thread-feed"]').should('be.visible');
    inboxComposeButton().should('be.visible');
    inboxComposeButton().click();
    communityIsLocked();
    communitySelected().contains('Spectrum');
    channelIsLocked();
    channelSelected().contains('General');

    cancelButton().click();

    secondInboxChannelFilter().click();
    cy.get('[data-cy="inbox-thread-feed"]').should('be.visible');
    inboxComposeButton().should('be.visible');
    inboxComposeButton().click();
    communityIsLocked();
    communitySelected().contains('Spectrum');
    channelIsLocked();
    channelSelected().contains('Private');
  });
});

describe('mobile tabbar composer', () => {
  beforeEach(() => {
    cy.auth(user.id);
    cy.viewport('iphone-6');
  });

  it('selects a community from the community view', () => {
    cy.visit('/spectrum');
    titlebarComposeButton()
      .should('be.visible')
      .click();
    communityIsLocked();
    channelDropdownIsEnabled();
    channelDropdown().contains('General');
    channelDropdown().contains('Private');
    cy.url().should(
      'eq',
      'http://localhost:3000/new/thread?composerCommunityId=1'
    );
  });

  it('selects a community and channel from the channel view', () => {
    cy.visit('/spectrum/general');
    titlebarComposeButton()
      .should('be.visible')
      .click();
    communityIsLocked();
    channelIsLocked();
    communitySelected().contains('Spectrum');
    channelSelected().contains('General');
    cy.url().should(
      'eq',
      'http://localhost:3000/new/thread?composerCommunityId=1&composerChannelId=1'
    );
  });

  it('does not select anything from the inbox everything view', () => {
    cy.visit('/');
    titlebarComposeButton()
      .should('be.visible')
      .click();
    communityDropdownIsEnabled();
    channelDropdownIsHidden();
    cy.url().should('eq', 'http://localhost:3000/new/thread');
  });

  it('selects a community from the inbox view with a community filter', () => {
    cy.visit('/');
    openMobileCommunityMenu();
    firstCommunityFilter().click();
    closeMobileCommunityMenu();
    titlebarComposeButton()
      .should('be.visible')
      .click();
    communityIsLocked();
    channelDropdownIsEnabled();
    cy.url().should(
      'eq',
      'http://localhost:3000/new/thread?composerCommunityId=1'
    );
  });

  it('selects a community and channel from the inbox view with a channel filter', () => {
    cy.visit('/');
    openMobileCommunityMenu();
    firstCommunityFilter().click();
    inboxChannelFilter().click();
    closeMobileCommunityMenu();
    titlebarComposeButton()
      .should('be.visible')
      .click();
    communityIsLocked();
    channelIsLocked();
    cy.url().should(
      'eq',
      'http://localhost:3000/new/thread?composerCommunityId=1&composerChannelId=1'
    );
  });
});
