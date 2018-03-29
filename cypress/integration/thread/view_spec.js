import data from '../../../shared/testing/data';
import { toPlainText, toState } from '../../../shared/draft-utils';
import constants from '../../../api/migrations/seed/default/constants';

const publicChannel = data.channels.find(
  c => c.id === constants.SPECTRUM_GENERAL_CHANNEL_ID
);
const privateChannel = data.channels.find(
  c => c.id === constants.SPECTRUM_PRIVATE_CHANNEL_ID
);

const publicCommunity = data.communities.find(
  c => c.id === constants.SPECTRUM_COMMUNITY_ID
);

const publicThread = data.threads.find(
  t => t.communityId === publicCommunity.id && t.channelId === publicChannel.id
);
const deletedThread = data.threads.find(t => t.deletedAt);
const privateThread = data.threads.find(
  t => t.communityId === publicCommunity.id && t.channelId === privateChannel.id
);

const publicThreadAuthor = data.users.find(
  u => u.id === publicThread.creatorId
);

const nonMemberUser = data.users.find(u => u.id === constants.QUIET_USER_ID);
const memberInChannelUser = data.users.find(u => u.id === constants.BRIAN_ID);
const blockedChannelUser = data.usersChannels.find(
  u => u.id === constants.BLOCKED_USER_ID
);
const blockedCommunityUser = data.usersCommunities.find(
  u => u.id === constants.BLOCKED_USER_ID
);

describe('sidebar components on thread view', () => {
  describe('non authed', () => {
    before(() => {
      cy.visit(`/thread/${publicThread.id}`);
    });

    it('should render', () => {
      // loaded login upsell in sidebar
      cy.get('[data-cy="thread-sidebar-login"]').should('be.visible');

      // loaded community info
      cy.get('[data-cy="thread-sidebar-community-info"]').should('be.visible');

      // loaded join button which directs to login
      cy
        .get('[data-cy="thread-sidebar-join-login-button"]')
        .should('be.visible');

      // loaded more conversations component
      cy.get('[data-cy="thread-sidebar-more-threads"]').should('be.visible');
    });
  });

  describe('authed non member', () => {
    before(() => {
      cy.auth(nonMemberUser.id);
      cy.visit(`/thread/${publicThread.id}`);
    });

    it('should render', () => {
      // loaded login upsell in sidebar
      cy.get('[data-cy="thread-sidebar-login"]').should('not.be.visible');

      // loaded community info
      cy.get('[data-cy="thread-sidebar-community-info"]').should('be.visible');

      // loaded join button which directs to login
      cy
        .get('[data-cy="thread-sidebar-join-community-button"]')
        .should('be.visible');

      // loaded more conversations component
      cy.get('[data-cy="thread-sidebar-more-threads"]').should('be.visible');
    });
  });

  describe('authed member', () => {
    before(() => {
      cy.auth(memberInChannelUser.id);
      cy.visit(`/thread/${publicThread.id}`);
    });

    it('should render', () => {
      // loaded login upsell in sidebar
      cy.get('[data-cy="thread-sidebar-login"]').should('not.be.visible');

      // loaded community info
      cy.get('[data-cy="thread-sidebar-community-info"]').should('be.visible');

      // loaded join button which directs to login
      cy
        .get('[data-cy="thread-sidebar-view-community-button"]')
        .should('be.visible');

      // loaded more conversations component
      cy.get('[data-cy="thread-sidebar-more-threads"]').should('be.visible');
    });
  });
});

describe('public thread', () => {
  describe('not authed', () => {
    before(() => {
      cy.visit(`/thread/${publicThread.id}`);
    });

    it('should render', () => {
      // loaded thread view
      cy.get('[data-cy="thread-view"]').should('be.visible');

      // thread data loaded
      cy.contains(publicThread.content.title);
      cy.contains(
        toPlainText(toState(JSON.parse(publicThread.content.body))).split(
          ' '
        )[0]
      );

      // thread author info loaded
      cy.contains(publicThreadAuthor.name);
      cy.contains(publicThreadAuthor.username);
      cy
        .get(`[href*="/users/${publicThreadAuthor.username}"]`)
        .should('be.visible');
    });
  });

  describe('authed as non member', () => {
    before(() => {
      cy.auth(nonMemberUser.id);
      cy.visit(`/thread/${publicThread.id}`);
    });

    it('should render', () => {
      // loaded thread view
      cy.get('[data-cy="thread-view"]').should('be.visible');
    });
  });

  describe('authed as member', () => {
    before(() => {
      cy.auth(memberInChannelUser.id);
      cy.visit(`/thread/${publicThread.id}`);
    });

    it('should render', () => {
      cy.get('[data-cy="thread-view"]').should('be.visible');
    });
  });

  describe('authed as blocked channel user', () => {
    before(() => {
      cy.auth(blockedChannelUser.id);
      cy.visit(`/thread/${publicThread.id}`);
    });

    it('should render', () => {
      cy.get('[data-cy="thread-view"]').should('not.be.visible');
      cy.get('[data-cy="blocked-thread-view"]').should('be.visible');
    });
  });

  describe('authed as blocked community user', () => {
    before(() => {
      cy.auth(blockedCommunityUser.id);
      cy.visit(`/thread/${publicThread.id}`);
    });

    it('should render', () => {
      cy.get('[data-cy="thread-view"]').should('not.be.visible');
      cy.get('[data-cy="blocked-thread-view"]').should('be.visible');
    });
  });
});

describe('private thread', () => {
  describe('not authed', () => {
    before(() => {
      cy.visit(`/thread/${privateThread.id}`);
    });

    it('should render', () => {
      // loaded thread view
      cy.get('[data-cy="thread-view"]').should('not.be.visible');
      cy.get('[data-cy="null-thread-view"]').should('be.visible');
    });
  });

  describe('authed as non member', () => {
    before(() => {
      cy.auth(nonMemberUser.id);
      cy.visit(`/thread/${privateThread.id}`);
    });

    it('should render', () => {
      // loaded thread view
      cy.get('[data-cy="null-thread-view"]').should('be.visible');
    });
  });

  describe('authed as member', () => {
    before(() => {
      cy.auth(memberInChannelUser.id);
      cy.visit(`/thread/${privateThread.id}`);
    });

    it('should render', () => {
      cy.get('[data-cy="thread-view"]').should('be.visible');
    });
  });

  describe('authed as blocked channel user', () => {
    before(() => {
      cy.auth(blockedChannelUser.id);
      cy.visit(`/thread/${privateThread.id}`);
    });

    it('should render', () => {
      cy.get('[data-cy="thread-view"]').should('not.be.visible');
      cy.get('[data-cy="null-thread-view"]').should('be.visible');
    });
  });

  describe('authed as blocked community user', () => {
    before(() => {
      cy.auth(blockedCommunityUser.id);
      cy.visit(`/thread/${privateThread.id}`);
    });

    it('should render', () => {
      cy.get('[data-cy="thread-view"]').should('not.be.visible');
      cy.get('[data-cy="null-thread-view"]').should('be.visible');
    });
  });
});

describe('deleted thread', () => {
  describe('not authed', () => {
    before(() => {
      cy.visit(`/thread/${deletedThread.id}`);
    });

    it('should render', () => {
      cy.get('[data-cy="thread-view"]').should('not.be.visible');
      cy.get('[data-cy="null-thread-view"]').should('be.visible');
    });
  });

  describe('authed', () => {
    before(() => {
      cy.auth(nonMemberUser.id);
      cy.visit(`/thread/${deletedThread.id}`);
    });

    it('should render', () => {
      cy.get('[data-cy="thread-view"]').should('not.be.visible');
      cy.get('[data-cy="null-thread-view"]').should('be.visible');
    });
  });
});
