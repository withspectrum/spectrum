import data from '../../../shared/testing/data';

const user = data.users[0];
const userCommunityIds = data.usersCommunities
  .filter(({ userId }) => user.id === userId)
  .map(({ communityId }) => communityId);
const expectedVisibleThreadsForUser = data.threads.filter(
  ({ communityId, isPublished }) =>
    userCommunityIds.includes(communityId) && isPublished
);
const userCommunityToTest = data.communities.find(
  community => community.id === userCommunityIds[0]
);

describe('Inbox view', () => {
  beforeEach(() => {
    cy.auth(user.id);
    cy.visit('/');
  });

  const scrollAndLoadThreads = initialThreadCount => {
    cy.get('[data-cy="inbox-thread-feed"]')
      .get('#scroller-for-inbox')
      .scrollTo('bottom');

    return cy
      .get('[data-cy="inbox-thread-item"]')
      .should('have.length.greaterThan', initialThreadCount);
  };

  it('should render more threads as user scrolls to the bottom twice', () => {
    cy.get('[data-cy="inbox-thread-item"]')
      .then($threadViewList => {
        const initialThreadCount = $threadViewList.length;
        // Ensure that the user under test has access to enough threads for two scrolldowns
        expect(initialThreadCount * 3).to.be.lessThan(
          expectedVisibleThreadsForUser.length
        );
        return scrollAndLoadThreads(initialThreadCount);
      })
      .then($expandedThreadViewList => {
        const intermediateThreadCount = $expandedThreadViewList.length;
        scrollAndLoadThreads(intermediateThreadCount);
      });
  });

  describe('Filtering operations', () => {
    beforeEach(() => {
      cy.auth(user.id);
      cy.visit('/');
    });

    const threadIdsOfUserCommunityToTest = data.threads
      .filter(thread => thread.communityId === userCommunityToTest.id)
      .map(thread => thread.id);

    it('should include a link to the filtered community', () => {
      cy.get(
        `[data-cy="community-list-item-${userCommunityToTest.id}"]`
      ).click();

      cy.get('[data-cy="channels-container"]').find(
        `a[href="/${userCommunityToTest.slug}"]`
      );
    });

    it('should filter threads by community', () => {
      // Ensure more than one community's threads are visible initially
      cy.get('[data-cy="inbox-thread-item"]')
        .get('[data-cy="header-community-name"]')
        .then(communityNameElements => {
          const communitySlugs = new Set();
          for (let i = 0; i < communityNameElements.length; i++) {
            const hrefValue = communityNameElements[i].attributes.getNamedItem(
              'href'
            ).value;
            const slug = hrefValue.split('/')[1];
            communitySlugs.add(slug);
          }
          expect(communitySlugs.size).to.be.greaterThan(1);
          expect(communitySlugs.has(userCommunityToTest.slug)).to.be.true;
        });

      // Invoke the community filter
      cy.get(`[data-cy="community-list-item-${userCommunityToTest.id}"]`)
        .click()
        .get('[data-cy="header-community-title"]')
        .invoke('text')
        .should('eq', userCommunityToTest.name);

      // Ensure now only the one community's threads are visible
      cy.get('[data-cy="inbox-thread-feed"]')
        .get('[data-cy="inbox-thread-link"]')
        .then($anchors => {
          const visibleThreadIds = [];
          for (let i = 0; i < $anchors.length; i++) {
            const anchorUrl = new URL($anchors[i]['href']);
            const anchorThreadId = anchorUrl.searchParams.get('t');
            visibleThreadIds.push(anchorThreadId);
          }
          const threadIdsFromOtherCommunities = visibleThreadIds.filter(
            id => !threadIdsOfUserCommunityToTest.includes(id)
          );
          expect(threadIdsFromOtherCommunities.length).to.eq(0);
        });
    });

    const userCommunityChannelToTest = data.channels.filter(
      channel =>
        channel.communityId === userCommunityToTest.id &&
        channel.slug !== 'general'
    )[0];

    const threadIdsOfUserCommunityChannelToTest = data.threads
      .filter(thread => thread.channelId === userCommunityChannelToTest.id)
      .map(thread => thread.id);

    it('should filter threads by channel within a community', () => {
      // Invoke the community filter
      cy.get(`[data-cy="community-list-item-${userCommunityToTest.id}"]`)
        .click()
        .get('[data-cy="header-community-title"]')
        .invoke('text')
        .should('eq', userCommunityToTest.name);

      // Ensure more than one channel's threads are visible initially
      cy.get('[data-cy="inbox-thread-feed"]')
        .get('[data-cy="header-channel-name"]')
        .then($channelPillElements => {
          const channelNames = new Set();
          for (let i = 0; i < $channelPillElements.length; i++) {
            channelNames.add($channelPillElements[i].textContent);
          }
          expect(channelNames.size).to.be.greaterThan(1);
          expect(channelNames.has(userCommunityChannelToTest.name)).to.be.true;
        });

      // Invoke the channel filter
      cy.get(
        `[data-cy="channel-list-item-${userCommunityChannelToTest.id}"]`
      ).click();
      cy.get('[data-cy="header-channel-title"]')
        .invoke('text')
        .should('eq', userCommunityChannelToTest.name);

      // Ensure now only the one channel's threads are visible
      cy.get('[data-cy="inbox-thread-feed"]')
        .get('[data-cy="inbox-thread-link"]')
        .then($anchors => {
          const visibleThreadIds = [];
          for (let i = 0; i < $anchors.length; i++) {
            const anchorUrl = new URL($anchors[i]['href']);
            const anchorThreadId = anchorUrl.searchParams.get('t');
            visibleThreadIds.push(anchorThreadId);
          }
          const threadIdsFromOtherChannels = visibleThreadIds.filter(
            id => !threadIdsOfUserCommunityChannelToTest.includes(id)
          );
          expect(threadIdsFromOtherChannels.length).to.eq(0);
        });
    });
  });
});

describe('Inbox view, when logged in as owner of a community', () => {
  before(() => {
    // Ensure user under test is owner of community under test
    expect(
      data.usersCommunities.filter(
        userCommunity =>
          userCommunity.communityId === userCommunityToTest.id &&
          userCommunity.userId === user.id
      )[0].isOwner
    ).to.be.true;
  });

  beforeEach(() => {
    cy.auth(user.id);
    cy.visit('/');
  });

  it('should have link to community settings when filtered', () => {
    cy.get(`[data-cy="community-list-item-${userCommunityToTest.id}"]`)
      .click()
      .get('[data-cy="channels-container"]')
      .find(`a[href="/${userCommunityToTest.slug}/settings"]`);
  });
});
