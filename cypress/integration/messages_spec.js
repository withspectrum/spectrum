import data from '../../shared/testing/data';

const user = data.users.find(user => user.username === 'brian');
const directMessages = data.usersDirectMessageThreads.filter(
  udm => udm.userId === user.id
);

const newMessage = 'Persist New Message';

describe('/new/message', () => {
  beforeEach(() => {
    cy.auth(user.id);
  });

  it('should show the message composer modal with search', () => {
    cy.visit('/new/message');
    cy.get('[data-cy="dm-composer"]').should('be.visible');
    cy.get('[data-cy="dm-composer-search"]').should('be.visible');
  });

  it('should render in a modal from another view', () => {
    cy.visit('/users/bryn');
    cy.get('[data-cy="message-user-button"]')
      .last()
      .should('be.visible')
      .click();
    cy.get('[data-cy="dm-composer"]').should('be.visible');
    cy.get('[data-cy="chat-input"]').should('be.visible');
    cy.url().should('include', '/new/message');
  });

  it('should send a direct message', () => {
    cy.visit('/users/bryn');
    cy.get('[data-cy="message-user-button"]')
      .last()
      .should('be.visible')
      .click();
    cy.get('[data-cy="dm-composer"]').should('be.visible');
    cy.get('[data-cy="chat-input"]').should('be.visible');
    cy.get('[data-cy="chat-input"]').type(newMessage);
    cy.get('[data-cy="chat-input-send-button"]').click();
    cy.get('[data-cy="message-group"]').should('be.visible');
  });

  it('should persist the dm chat input', () => {
    cy.visit('/users/bryn');
    cy.get('[data-cy="message-user-button"]')
      .last()
      .should('be.visible')
      .click();
    cy.get('[data-cy="dm-composer"]').should('be.visible');
    cy.get('[data-cy="chat-input"]').should('be.visible');
    cy.get('[data-cy="chat-input"]').type(newMessage);
    cy.wait(2000);
    cy.reload();
    cy.visit('/users/bryn');
    cy.get('[data-cy="message-user-button"]')
      .last()
      .should('be.visible')
      .click();
    cy.get('[data-cy="dm-composer"]').should('be.visible');
    cy.get('[data-cy="chat-input"]').contains(newMessage);
  });
});

describe('/messages', () => {
  beforeEach(() => {
    cy.auth(user.id).then(() => cy.visit('/messages'));
  });

  it('should load list of direct messages', () => {
    cy.contains('Max Stoiber and Bryn Jackson').should('be.visible');
    cy.contains('A fifth one').should('be.visible');

    cy.contains('Previous member').should('be.visible');
    cy.contains('No messages yet...').should('be.visible');

    cy.get('[data-cy="unread-dm-list-item"]').should($p => {
      expect($p).to.have.length(1);
    });
    cy.get('[data-cy="dm-list-item"]').should($p => {
      expect($p).to.have.length(1);
    });
  });

  it('should open conversation composer', () => {
    cy.get('[data-cy="compose-dm"]')
      .should('be.visible')
      .click();
    cy.url().should('eq', 'http://localhost:3000/new/message');
  });

  it('should select an individual conversation', () => {
    cy.contains('Max Stoiber and Bryn Jackson')
      .should('be.visible')
      .click();
    cy.get('[data-cy="dm-header"]').should('be.visible');
    cy.get('[data-cy="dm-header"]').contains('Max Stoiber, Bryn Jackson');
    cy.get('[data-cy="message"]').should($p => {
      expect($p).to.have.length(5);
    });
  });

  it('should switch conversations', () => {
    cy.contains('Max Stoiber and Bryn Jackson')
      .should('be.visible')
      .click();
    cy.get('[data-cy="dm-header"]').should('be.visible');
    cy.get('[data-cy="dm-header"]').contains('Max Stoiber, Bryn Jackson');
    cy.get('[data-cy="message"]').should($p => {
      expect($p).to.have.length(5);
    });

    cy.contains('Previous member')
      .should('be.visible')
      .click();
    cy.get('[data-cy="dm-header"]').should('not.be.visible');
    cy.get('[data-cy="message"]').should($p => {
      expect($p).to.have.length(0);
    });
  });

  it('should send a message in a conversation', () => {
    cy.contains('Previous member')
      .should('be.visible')
      .click();

    const newMessage = 'A new message!';
    cy.get('[data-cy="chat-input"]').type(newMessage);
    cy.get('[data-cy="chat-input-send-button"]').click();
    cy.get('[data-cy="chat-input"]').clear();
    cy.contains(newMessage);

    cy.get('[data-cy="unread-dm-list-item"]').should($p => {
      expect($p).to.have.length(0);
    });

    cy.get('[data-cy="dm-list-item"]').should($p => {
      expect($p).to.have.length(2);
    });

    cy.wait(2000);

    cy.get('[data-cy="dm-list-item"]')
      .first()
      .contains('Previous member');
  });
});

describe('messages tab badge count', () => {
  beforeEach(() => {
    cy.auth(user.id).then(() => cy.visit('/spectrum'));
  });

  it('should show a badge for unread direct messages', () => {
    cy.get('[data-cy="unread-dm-badge"]').should('be.visible');
  });

  it('should clear the badge when messages tab clicked', () => {
    cy.get('[data-cy="unread-dm-badge"]').should('be.visible');
    cy.get('[data-cy="navigation-messages"]').click();
    cy.get('[data-cy="dm-list-item"]').should($p => {
      expect($p).to.have.length(1);
    });
    cy.get('[data-cy="unread-dm-list-item"]').should($p => {
      expect($p).to.have.length(1);
    });
    cy.get('[data-cy="unread-dm-badge"]').should('not.be.visible');
  });

  it('should not show an unread badge after leaving messages tab', () => {
    cy.get('[data-cy="unread-dm-badge"]').should('be.visible');
    cy.get('[data-cy="navigation-messages"]').click();
    cy.get('[data-cy="dm-list-item"]').should($p => {
      expect($p).to.have.length(1);
    });
    cy.get('[data-cy="unread-dm-list-item"]').should($p => {
      expect($p).to.have.length(1);
    });
    cy.get('[data-cy="unread-dm-badge"]').should('not.be.visible');
    cy.get('[data-cy="navigation-explore"]').click();
    cy.get('[data-cy="unread-dm-badge"]').should('not.be.visible');
  });
});

describe('clearing messages tab', () => {
  beforeEach(() => {
    cy.auth(user.id).then(() => cy.visit('/messages'));
  });

  it('should clear the badge when landing directly on /messages', () => {
    cy.get('[data-cy="dm-list-item"]').should($p => {
      expect($p).to.have.length(1);
    });
    cy.get('[data-cy="unread-dm-list-item"]').should($p => {
      expect($p).to.have.length(1);
    });
    cy.get('[data-cy="unread-dm-badge"]').should('not.be.visible');
  });
});
