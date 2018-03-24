// @flow
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
  before(() => {
    cy.visit(`/${community.slug}/${channel.slug}`);
  });

  it('should render list of threads', () => {
    data.threads
      .filter(thread => thread.channelId === channel.id)
      .forEach(thread => {
        cy.contains(thread.content.title);
      });
  });
});

describe('channel threads logged in', () => {
  before(() => {
    cy.auth(memberInChannelId);
    cy.visit(`/${community.slug}/${channel.slug}`);
  });

  it('should render list of threads', () => {
    data.threads
      .filter(thread => thread.channelId === channel.id)
      .forEach(thread => {
        cy.contains(thread.content.title);
      });
  });
});
