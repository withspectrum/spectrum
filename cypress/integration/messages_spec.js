import data from '../../shared/testing/data';

const thread = data.threads[0];
const community = data.communities.find(
  community => community.id === thread.communityId
);
const author = data.users.find(user => user.id === thread.creatorId);

describe('/messages/new', () => {
  beforeEach(() => {
    cy.auth(author.id);
    cy.visit('/messages/new');
  });

  it('should allow to continue composing message incase of crash or reload', () => {
    const newMessage = 'Persist New Message';
    cy.get('[contenteditable="true"]').type(newMessage);
    cy.get('[contenteditable="true"]').contains(newMessage);

    cy.wait(2000);
    // Reload page(incase page closed or crashed ,reload should have same effect)
    cy.reload();
    cy.get('[contenteditable="true"]').contains(newMessage);
  });
});
