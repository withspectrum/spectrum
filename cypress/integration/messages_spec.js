import data from '../../shared/testing/data';

const user = data.users.find(user => user.username === 'brian');

describe('/messages', () => {
  beforeEach(() => {
    cy.auth(user.id).then(() => cy.visit('/messages'));
  });

  it('should load list of direct messages', () => {
    cy.contains('Max Stoiber and Bryn Jackson').should('be.visible');
    cy.contains('A fifth one').should('be.visible');

    cy.contains('Previous member').should('be.visible');
    cy.contains('No messages yet...').should('be.visible');
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
});
