import data from '../../../../shared/testing/data';

const publicCommunity = data.communities.find(c => c.slug === 'spectrum');
const privateCommunity = data.communities.find(c => c.slug === 'private');

const publicUsersCommunities = data.usersCommunities
  .filter(
    uc =>
      uc.communityId === publicCommunity.id &&
      uc.isMember &&
      (uc.isOwner || uc.isModerator)
  )
  .map(uc => uc.userId);
const privateUsersCommunities = data.usersCommunities
  .filter(
    uc =>
      uc.communityId === privateCommunity.id &&
      uc.isMember &&
      (uc.isOwner || uc.isModerator)
  )
  .map(uc => uc.userId);
const publicTeamMembers = data.users.filter(
  u => publicUsersCommunities.indexOf(u.id) >= 0
);
const privateTeamMembers = data.users.filter(
  u => privateUsersCommunities.indexOf(u.id) >= 0
);

const { userId: memberInPublicCommunityId } = data.usersCommunities.find(
  ({ communityId, isMember }) => communityId === publicCommunity.id && isMember
);

const { userId: nonMemberInPublicCommunityId } = data.usersCommunities.find(
  ({ communityId, isMember, isBlocked }) =>
    communityId === publicCommunity.id && !isMember && !isBlocked
);

const { userId: memberInPrivateCommunityId } = data.usersCommunities.find(
  ({ communityId, isMember }) => communityId === privateCommunity.id && isMember
);

const { userId: nonMemberInPrivateCommunityId } = data.usersCommunities.find(
  ({ communityId, isMember, isBlocked }) =>
    communityId === privateCommunity.id && !isMember && !isBlocked
);

describe('public community signed out', () => {
  beforeEach(() => {
    cy.visit(`/${publicCommunity.slug}`);
  });

  it('should render profile', () => {
    cy.get('[data-cy="community-view"]').should('be.visible');
    cy.contains(publicCommunity.description);
    cy.contains(publicCommunity.name);
    cy.contains(publicCommunity.website);
  });

  it('should render threads', () => {
    cy.get('[data-cy="community-view-content"]')
      .scrollIntoView()
      .should('be.visible');

    data.threads
      .filter(
        thread => !thread.deletedAt && thread.communityId === publicCommunity.id
      )
      .forEach(thread =>
        cy
          .contains(thread.content.title)
          .scrollIntoView()
          .should('be.visible')
      );
  });

  it('should render channels', () => {
    data.channels
      .filter(channel => channel.communityId === publicCommunity.id)
      .filter(channel => !channel.isPrivate)
      .filter(channel => !channel.deletedAt)
      .filter(channel => !channel.archivedAt)
      .forEach(channel => {
        cy.contains(channel.name)
          .scrollIntoView()
          .should('be.visible');
      });
  });

  it('should render team', () => {
    publicTeamMembers.forEach(user => {
      cy.contains(user.name)
        .scrollIntoView()
        .should('be.visible');
    });
  });

  it('should prompt user to login when joining', () => {
    cy.get('[data-cy="join-community-button-login"]')
      .last()
      .scrollIntoView()
      .should('be.visible')
      .click();

    cy.get('[data-cy="login-modal"]').should('be.visible');
  });
});

describe('public community signed in without permission', () => {
  beforeEach(() => {
    cy.auth(nonMemberInPublicCommunityId).then(() =>
      cy.visit(`/${publicCommunity.slug}`)
    );
  });

  it('should render profile', () => {
    cy.get('[data-cy="community-view"]').should('be.visible');
    cy.contains(publicCommunity.description);
    cy.contains(publicCommunity.name);
    cy.contains(publicCommunity.website);
  });

  it('should render threads', () => {
    cy.get('[data-cy="community-view-content"]')
      .scrollIntoView()
      .should('be.visible');

    data.threads
      .filter(
        thread => !thread.deletedAt && thread.communityId === publicCommunity.id
      )
      .forEach(thread =>
        cy
          .contains(thread.content.title)
          .scrollIntoView()
          .should('be.visible')
      );
  });

  it('should render channels', () => {
    data.channels
      .filter(channel => channel.communityId === publicCommunity.id)
      .filter(channel => !channel.isPrivate)
      .filter(channel => !channel.deletedAt)
      .filter(channel => !channel.archivedAt)
      .forEach(channel => {
        cy.contains(channel.name)
          .scrollIntoView()
          .should('be.visible');
      });
  });

  it('should render team', () => {
    publicTeamMembers.forEach(user => {
      cy.contains(user.name)
        .scrollIntoView()
        .should('be.visible');
    });
  });

  it('should join the community', () => {
    cy.get('[data-cy="join-community-button"]')
      .last()
      .scrollIntoView()
      .should('be.visible');

    cy.get('[data-cy="join-community-button"]')
      .contains(`Join community`)
      .click();

    cy.get('[data-cy="leave-community-button"]')
      .contains(`Member`)
      .click();

    // triggered the leave modal
    cy.get('[data-cy="delete-button"]')
      .contains(`Leave Community`)
      .should('be.visible')
      .click();

    cy.get('[data-cy="delete-button"]').should('not.be.visible');

    cy.get('[data-cy="join-community-button"]')
      .last()
      .should('be.visible');
  });
});

describe('public community signed in with permission', () => {
  beforeEach(() => {
    cy.auth(memberInPublicCommunityId).then(() =>
      cy.visit(`/${publicCommunity.slug}`)
    );
  });

  it('should render profile', () => {
    cy.get('[data-cy="community-view"]').should('be.visible');
    cy.contains(publicCommunity.description);
    cy.contains(publicCommunity.name);
    cy.contains(publicCommunity.website);
  });
});

describe('private community signed out', () => {
  beforeEach(() => {
    cy.visit(`/${privateCommunity.slug}`);
  });

  it('should prompt a login', () => {
    cy.get('[data-cy="login-page"]').should('be.visible');
  });
});

describe('private community signed in without permission', () => {
  beforeEach(() => {
    cy.auth(nonMemberInPrivateCommunityId).then(() =>
      cy.visit(`/${privateCommunity.slug}`)
    );
  });

  it('should render the blocked page', () => {
    cy.get('[data-cy="community-view-private"]').should('be.visible');
    cy.contains('This community is private');
  });

  it('should request to join the private community', () => {
    cy.get('[data-cy="request-to-join-private-community-button"]')
      .should('be.visible')
      .contains(`Request to join`)
      .click();

    cy.get('[data-cy="cancel-request-to-join-private-community-button"]')
      .should('be.visible')
      .contains('Cancel request')
      .click();

    cy.get('[data-cy="request-to-join-private-community-button"]')
      .should('be.visible')
      .contains(`Request to join`);
  });
});

describe('private community signed in with permissions', () => {
  beforeEach(() => {
    cy.auth(memberInPrivateCommunityId).then(() =>
      cy.visit(`/${privateCommunity.slug}`)
    );
  });

  it('should render profile', () => {
    cy.get('[data-cy="community-view"]').should('be.visible');
    cy.contains(privateCommunity.description);
    cy.contains(privateCommunity.name);
    cy.contains(privateCommunity.website);
  });

  it('should render threads', () => {
    cy.get('[data-cy="community-view-content"]')
      .scrollIntoView()
      .should('be.visible');

    data.threads
      .filter(
        thread =>
          !thread.deletedAt && thread.communityId === privateCommunity.id
      )
      .forEach(thread =>
        cy.contains(thread.content.title).should('be.visible')
      );
  });

  it('should render channels', () => {
    data.channels
      .filter(channel => channel.communityId === privateCommunity.id)
      .filter(channel => !channel.isPrivate)
      .filter(channel => !channel.deletedAt)
      .filter(channel => !channel.archivedAt)
      .forEach(channel => {
        cy.get('[data-cy="channel-list"]')
          .contains(channel.name)
          .scrollIntoView()
          .should('be.visible');
      });
  });

  it('should render team', () => {
    privateTeamMembers.forEach(user => {
      cy.contains(user.name)
        .scrollIntoView()
        .should('be.visible');
    });
  });
});
