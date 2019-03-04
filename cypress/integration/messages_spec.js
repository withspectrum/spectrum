import data from '../../shared/testing/data';

const user = data.users.find(user => user.username === 'brian');
const directMessages = data.usersDirectMessageThreads.filter(
  udm => udm.userId === user.id
);

describe('/messages/new', () => {
  beforeEach(() => {
    cy.auth(user.id).then(() => cy.visit('/messages/new'));
  });

  it('should allow to continue composing message incase of crash or reload', () => {
    const newMessage = 'Persist New Message';
    cy.get('[data-cy="chat-input"]').type(newMessage);
    cy.get('[data-cy="chat-input"]').contains(newMessage);

    cy.wait(2000);
    // Reload page(incase page closed or crashed ,reload should have same effect)
    cy.reload();
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
    cy.url().should('eq', 'http://localhost:3000/messages/new');
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
    cy.get('[data-cy="dm-header"]').should('be.visible');
    cy.get('[data-cy="dm-header"]').contains('Previous member');
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
    cy.auth(user.id).then(() => cy.visit('/'));
  });

  it('should show a badge for unread direct messages', () => {
    cy.get('[data-cy="unread-badge-1"]').should('be.visible');
  });

  it('should clear the badge when messages tab clicked', () => {
    cy.get('[data-cy="unread-badge-1"]').should('be.visible');
    cy.get('[data-cy="navbar-messages"]').click();
    cy.get('[data-cy="dm-list-item"]').should($p => {
      expect($p).to.have.length(1);
    });
    cy.get('[data-cy="unread-dm-list-item"]').should($p => {
      expect($p).to.have.length(1);
    });
    cy.get('[data-cy="unread-badge-0"]').should('be.visible');
  });

  it('should not show an unread badge after leaving messages tab', () => {
    cy.get('[data-cy="unread-badge-1"]').should('be.visible');
    cy.get('[data-cy="navbar-messages"]').click();
    cy.get('[data-cy="dm-list-item"]').should($p => {
      expect($p).to.have.length(1);
    });
    cy.get('[data-cy="unread-dm-list-item"]').should($p => {
      expect($p).to.have.length(1);
    });
    cy.get('[data-cy="unread-badge-0"]').should('be.visible');
    cy.get('[data-cy="navbar-home"]').click();
    cy.get('[data-cy="unread-badge-0"]').should('be.visible');
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
    cy.get('[data-cy="unread-badge-0"]').should('be.visible');
  });
});

describe('sending a message from user profile', () => {
  beforeEach(() => {
    cy.auth(user.id).then(() => cy.visit('/users/bryn'));
  });

  const dmButton = () => cy.get('[data-cy="send-dm-button"]');
  const stagedDMPills = () => cy.get('[data-cy="selected-users-pills"]');
  const chatInput = () => cy.get('[data-cy="chat-input"]');
  const sendButton = () => cy.get('[data-cy="chat-input-send-button"]');

  it('sends a direct message from the user profile on desktop', () => {
    dmButton()
      .should('be.visible')
      .click();
    cy.url('eq', 'http://localhost:3000/messages/new');
    cy.get('[data-cy="unread-dm-list-item"]').should($p => {
      expect($p).to.have.length(1);
    });
    cy.get('[data-cy="dm-list-item"]').should($p => {
      expect($p).to.have.length(1);
    });
    stagedDMPills()
      .should('be.visible')
      .contains('Bryn');
    chatInput().type('New message');
    sendButton().click();
    cy.get('[data-cy="unread-dm-list-item"]').should($p => {
      expect($p).to.have.length(1);
    });
    cy.get('[data-cy="dm-list-item"]').should($p => {
      expect($p).to.have.length(2);
    });
  });

  it('sends a direct message from the user profile on mobile', () => {
    cy.viewport('iphone-6');
    dmButton()
      .should('be.visible')
      .click();
    cy.url('eq', 'http://localhost:3000/messages/new');
    stagedDMPills()
      .should('be.visible')
      .contains('Bryn');
    chatInput().type('New message');
    sendButton().click();
    cy.contains('Bryn Jackson');
    cy.contains('@bryn');
    cy.contains('New message');
    cy.get('[data-cy="titlebar-back"]').click();
    cy.url('eq', 'http://localhost:3000/messages');
    cy.get('[data-cy="unread-dm-list-item"]').should($p => {
      expect($p).to.have.length(1);
    });
    cy.get('[data-cy="dm-list-item"]').should($p => {
      expect($p).to.have.length(2);
    });
  });
});
