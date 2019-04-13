import data from '../../shared/testing/data';
const user = data.users[0];

const toastMessage = 'This is a long toast message';

describe('Toasts and url query paramaters', () => {
  beforeEach(() => {
    cy.auth(user.id);
  });

  it('should show toast', () => {
    const url = new URL('http://localhost:3000/me/settings');
    url.searchParams.append('toastType', 'success');
    url.searchParams.append('toastMessage', toastMessage);
    cy.visit(url.toString());
    cy.get('[data-cy="toast-success"]').contains(toastMessage);
    cy.url().should('eq', 'http://localhost:3000/users/mxstbr/settings');
  });

  it('should not show toast if no toastType', () => {
    const url = new URL('http://localhost:3000/me/settings');
    url.searchParams.append('toastMessage', toastMessage);
    cy.visit(url.toString());
    cy.get('[data-cy="toast-success"]').should('have.length', 0);
    cy.url().should('eq', 'http://localhost:3000/users/mxstbr/settings');
  });

  it('should not show toast if no toastMessage', () => {
    const url = new URL('http://localhost:3000/me/settings');
    url.searchParams.append('toastType', 'success');
    cy.visit(url.toString());
    cy.get('[data-cy="toast-success"]', { timeout: 1 }).should(
      'have.length',
      0
    );
    cy.url().should('eq', 'http://localhost:3000/users/mxstbr/settings');
  });

  it('should not show toast if invalid toastType', () => {
    const url = new URL('http://localhost:3000/me/settings');
    url.searchParams.append('toastType', 'foo');
    cy.visit(url.toString());
    cy.get('[data-cy="toast-success"]', { timeout: 1 }).should(
      'have.length',
      0
    );
    cy.url().should('eq', 'http://localhost:3000/users/mxstbr/settings');
  });

  it('should preserve existing query parameters', () => {
    const url = new URL(
      'http://localhost:3000/spectrum/general/another-thread~thread-2?m=MTQ4MzIyNTIwMDAwMg=='
    );
    url.searchParams.append('toastType', 'success');
    url.searchParams.append('toastMessage', toastMessage);
    cy.visit(url.toString());
    cy.get('[data-cy="toast-success"]', { timeout: 100 }).should(
      'have.length',
      1
    );
    cy.url().should(
      'eq',
      'http://localhost:3000/spectrum/general/another-thread~thread-2?m=MTQ4MzIyNTIwMDAwMg=='
    );
  });
});
