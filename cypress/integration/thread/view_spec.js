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
    beforeEach(() => {
      cy.visit(`/thread/${publicThread.id}`);
    });

    it('should render', () => {
      // loaded community info
      cy.get('[data-cy="community-profile-card"]')
        .scrollIntoView()
        .should('be.visible');

      // loaded join button which directs to login
      cy.get('[data-cy="profile-join-button"]').should('be.visible');
    });
  });

  describe('authed non member', () => {
    beforeEach(() => {
      cy.auth(nonMemberUser.id).then(() =>
        cy.visit(`/thread/${publicThread.id}`)
      );
    });

    it('should render', () => {
      // loaded community info
      cy.get('[data-cy="community-profile-card"]')
        .scrollIntoView()
        .should('be.visible');

      // loaded join button which directs to login
      cy.get('[data-cy="profile-join-button"]')
        .scrollIntoView()
        .should('be.visible');
    });
  });

  describe('authed member', () => {
    beforeEach(() => {
      cy.auth(memberInChannelUser.id).then(() =>
        cy.visit(`/thread/${publicThread.id}`)
      );
    });

    it('should render', () => {
      // loaded community info
      cy.get('[data-cy="community-profile-card"]')
        .scrollIntoView()
        .should('be.visible');

      // loaded join button which directs to login
      cy.get('[data-cy="community-profile-card"]')
        .scrollIntoView()
        .should('be.visible');
    });
  });
});

describe('public thread', () => {
  describe('not authed', () => {
    beforeEach(() => {
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
      cy.get(`[href*="/users/${publicThreadAuthor.username}"]`).should(
        'be.visible'
      );
    });
  });

  describe('authed as non member', () => {
    beforeEach(() => {
      cy.auth(nonMemberUser.id).then(() =>
        cy.visit(`/thread/${publicThread.id}`)
      );
    });

    it('should render', () => {
      // loaded thread view
      cy.get('[data-cy="thread-view"]').should('be.visible');
    });
  });

  describe('authed as member', () => {
    beforeEach(() => {
      cy.auth(memberInChannelUser.id).then(() =>
        cy.visit(`/thread/${publicThread.id}`)
      );
    });

    it('should render', () => {
      cy.get('[data-cy="thread-view"]').should('be.visible');
    });
  });

  describe('authed as blocked channel user', () => {
    beforeEach(() => {
      cy.auth(blockedChannelUser.id).then(() =>
        cy.visit(`/thread/${publicThread.id}`)
      );
    });

    it('should render', () => {
      cy.get('[data-cy="thread-view"]').should('not.be.visible');
      cy.get('[data-cy="null-thread-view"]').should('be.visible');
    });
  });

  describe('authed as blocked community user', () => {
    beforeEach(() => {
      cy.auth(blockedCommunityUser.id).then(() =>
        cy.visit(`/thread/${publicThread.id}`)
      );
    });

    it('should render', () => {
      cy.get('[data-cy="thread-view"]').should('not.be.visible');
      cy.get('[data-cy="null-thread-view"]').should('be.visible');
    });
  });
});

describe('private thread', () => {
  describe('not authed', () => {
    beforeEach(() => {
      cy.visit(`/thread/${privateThread.id}`);
    });

    it('should render', () => {
      // loaded thread view
      cy.get('[data-cy="thread-view"]').should('not.be.visible');
      cy.get('[data-cy="null-thread-view"]').should('be.visible');
    });
  });

  describe('authed as non member', () => {
    beforeEach(() => {
      cy.auth(nonMemberUser.id).then(() =>
        cy.visit(`/thread/${privateThread.id}`)
      );
    });

    it('should render', () => {
      // loaded thread view
      cy.get('[data-cy="null-thread-view"]').should('be.visible');
    });
  });

  describe('authed as member', () => {
    beforeEach(() => {
      cy.auth(memberInChannelUser.id).then(() =>
        cy.visit(`/thread/${privateThread.id}`)
      );
    });

    it('should render', () => {
      cy.get('[data-cy="thread-view"]').should('be.visible');
    });
  });

  describe('authed as blocked channel user', () => {
    beforeEach(() => {
      cy.auth(blockedChannelUser.id).then(() =>
        cy.visit(`/thread/${privateThread.id}`)
      );
    });

    it('should render', () => {
      cy.get('[data-cy="thread-view"]').should('not.be.visible');
      cy.get('[data-cy="null-thread-view"]').should('be.visible');
    });
  });

  describe('authed as blocked community user', () => {
    beforeEach(() => {
      cy.auth(blockedCommunityUser.id).then(() =>
        cy.visit(`/thread/${privateThread.id}`)
      );
    });

    it('should render', () => {
      cy.get('[data-cy="thread-view"]').should('not.be.visible');
      cy.get('[data-cy="null-thread-view"]').should('be.visible');
    });
  });
});

describe('deleted thread', () => {
  describe('not authed', () => {
    beforeEach(() => {
      cy.visit(`/thread/${deletedThread.id}`);
    });

    it('should render', () => {
      cy.get('[data-cy="thread-view"]').should('not.be.visible');
      cy.get('[data-cy="null-thread-view"]').should('be.visible');
    });
  });

  describe('authed', () => {
    beforeEach(() => {
      cy.auth(nonMemberUser.id).then(() =>
        cy.visit(`/thread/${deletedThread.id}`)
      );
    });

    it('should render', () => {
      cy.get('[data-cy="thread-view"]').should('not.be.visible');
      cy.get('[data-cy="null-thread-view"]').should('be.visible');
    });
  });
});
