import data from '../../../shared/testing/data';

const user = data.users[0];
const userCommunityIds = data.usersCommunities
  .filter(({ userId }) => user.id === userId)
  .map(({ communityId }) => communityId);
const expectedVisibleThreadsForUser = data.threads.filter(
  ({ communityId, isPublished }) =>
    userCommunityIds.includes(communityId) && isPublished
);

const scrollAndLoadThreads = initialThreadCount => {
  cy.get('[data-cy="inbox-thread-feed"]')
    .get('#scroller-for-inbox')
    .scrollTo('bottom');
  return cy
    .get('[data-cy="inbox-thread-item"]')
    .should('have.length.greaterThan', initialThreadCount);
};

describe('Inbox view', () => {
  beforeEach(() => {
    cy.auth(user.id);
    cy.visit('/');
  });

  it('should render more threads as user scrolls to the bottom twice', () => {
    cy.get('[data-cy="inbox-thread-item"]')
      .then($threadViewList => {
        const initialThreadCount = $threadViewList.length;
        // Assert that the mock data has enough threads for two scrolldowns
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

  xdescribe('Filtering operations', () => {
    beforeEach(() => {
      cy.auth(user.id);
      cy.visit('/');
    });

    it('should filter threads by community', () => {
      // Ensure more than one community's threads are visible initially
      cy.get('[data-cy="inbox-thread-feed"]')
        .get('[data-cy="meta-community-name"]')
        .then($communityNameElements => {
          const communityNames = new Set();
          for (let i = 0; i < $communityNameElements.length; i++) {
            communityNames.add($communityNameElements[i].text);
          }
          expect(communityNames.size).to.be.greaterThan(1);
        });
      // Open the sidebar
      // Perform the filter
      // Close the filter bar
      // Assert that we can only see the filtered community's threads
      // TODO
    });

    it('should filter threads by channel within a community', () => {
      // TODO
    });

    it('should include a link to the filtered community', () => {
      // TODO
    });
  });
});

describe('Inbox view, when logged in as owner of a community', () => {
  beforeEach(() => {
    // cy.auth(ownerUser.id);
    cy.visit('/');
  });

  it('should filter threads by community', () => {
    // TODO
  });
});
