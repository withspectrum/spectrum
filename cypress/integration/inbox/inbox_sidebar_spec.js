import { user } from './inbox_spec_constants';

describe('Inbox view sidebar, when logged in as non-admin', () => {
  beforeEach(() => {
    cy.auth(user.id);
    cy.visit('/');
  });
  it('should render more threads as user scrolls infinitely', () => {
    // TODO
  });
  describe('Filtering operations', () => {
    it('should filter threads by community', () => {
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
describe('Inbox view sidebar, when logged in as admin of community', () => {
  beforeEach(() => {
    // cy.auth(user.id);
    cy.visit('/');
  });
  it('should filter threads by community', () => {
    // TODO
  });
});
