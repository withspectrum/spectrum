import data from '../../../../shared/testing/data';

const channel = data.channels[0];

const community = data.communities.find(
  community => community.id === channel.communityId
);

const { userId: memberInChannelId } = data.usersChannels.find(
  ({ channelId, isMember, isOwner }) =>
    channelId === channel.id && isMember && !isOwner
);

describe('channel threads logged out', () => {
  beforeEach(() => {
    cy.visit(`/${community.slug}/${channel.slug}`);
  });

  it('should render list of threads', () => {
    data.threads
      .filter(thread => !thread.deletedAt && thread.channelId === channel.id)
      .forEach(thread => {
        cy.contains(thread.content.title);
      });
  });
});

describe('channel threads logged in', () => {
  beforeEach(() => {
    cy.auth(memberInChannelId).then(() =>
      cy.visit(`/${community.slug}/${channel.slug}`)
    );
  });

  it('should render list of threads', () => {
    data.threads
      .filter(thread => !thread.deletedAt && thread.channelId === channel.id)
      .forEach(thread => {
        cy.contains(thread.content.title);
      });
  });
});
