import data from '../../../shared/testing/data';

const getUserCommunityIds = targetUserId =>
  data.usersCommunities
    .filter(({ userId }) => targetUserId === userId)
    .map(({ communityId }) => communityId);

const getVisibleThreads = userCommunityIds =>
  data.threads.filter(
    ({ communityId, isPublished }) =>
      userCommunityIds.includes(communityId) && isPublished
  );

const getCommunity = communityId =>
  data.communities.find(community => community.id === communityId);

describe('Inbox view, when logged in as owner of a community', () => {
  const user = data.users[0]; // Must be owner of userCommunityToTest
  const userCommunityIds = getUserCommunityIds(user.id);
  const userCommunityToTest = getCommunity(userCommunityIds[0]);

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

describe('Inbox view', () => {
  const user = data.users[1]; // Must not be owner of userCommunityToTest
  const userCommunityIds = getUserCommunityIds(user.id);
  const expectedVisibleThreadsForUser = getVisibleThreads(userCommunityIds);
  const userCommunityToTest = getCommunity(userCommunityIds[0]);

  beforeEach(() => {
    cy.auth(user.id);
    cy.visit('/');
  });

  it('should NOT have link to community settings when filtered', () => {
    cy.get(`[data-cy="community-list-item-${userCommunityToTest.id}"]`)
      .click()
      .get('[data-cy="channels-container"]')
      .not(`a[href="/${userCommunityToTest.slug}/settings"]`);
  });

  const scrollAndLoadThreads = initialThreadCount => {
    cy.get('[data-cy="scroller-for-inbox"]').scrollTo('bottom');

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
