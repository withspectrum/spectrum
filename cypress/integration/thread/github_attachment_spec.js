import data from '../../../shared/testing/data';
import constants from '../../../api/migrations/seed/default/constants';

const publicChannel = data.channels.find(
  c => c.id === constants.SPECTRUM_GENERAL_CHANNEL_ID
);

const publicCommunity = data.communities.find(
  c => c.id === constants.SPECTRUM_COMMUNITY_ID
);

const publicThread = data.threads.find(
  t => t.communityId === publicCommunity.id && t.channelId === publicChannel.id
);

const memberInChannelUser = data.users.find(u => u.id === constants.BRIAN_ID);

describe('github attachment', () => {
  describe('authed', () => {
    beforeEach(() => {
      cy.auth(memberInChannelUser.id).then(() =>
        cy.visit(`/thread/${publicThread.id}`)
      );
    });

    it('should render attachment for git link', () => {
      let message = 'https://github.com/withspectrum/spectrum/issues/5119';
      cy.get('[data-cy="chat-input"]').type(message);
      cy.get('[data-cy="chat-input-send-button"]').click();
      cy.get('[data-cy="github-attachment"]').should('be.visible');
    });

    it('should not render invalid link ', () => {
      let message = 'https://github.com/withspectrum/spectrum/issues/511967';
      cy.get('[data-cy="chat-input"]').type(message);
      cy.get('[data-cy="chat-input-send-button"]').click();
      cy.get('[data-cy="github-attachment"]').should('not.be.visible');
    });
  });
});
