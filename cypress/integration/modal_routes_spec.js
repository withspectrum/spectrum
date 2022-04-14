import data from '../../shared/testing/data';
const user = data.users.find(user => user.username === 'brian');

const pressEscape = () =>
  cy.get('[data-cy="modal-container"]').trigger('keydown', { keyCode: 27 });

const communityBeforeUrlIsValid = () =>
  cy.url().should('eq', 'http://localhost:3000/spectrum?tab=posts');
const channelBeforeUrlIsValid = () =>
  cy.url().should('eq', 'http://localhost:3000/spectrum/general?tab=posts');

describe.skip('thread modal route', () => {
  const threadSlider = () => cy.get('[data-cy="modal-container"]');
  const threadSliderClose = () => cy.get('[data-cy="thread-slider-close"]');

  it('handles esc key', () => {
    cy.visit('/spectrum');
    cy.get('[data-cy="thread-card"]')
      .first()
      .click();
    threadSlider().should('be.visible');
    cy.url(
      'eq',
      'http://localhost:3000/spectrum/private/yet-another-thread~thread-6'
    );

    pressEscape();

    communityBeforeUrlIsValid();
    threadSlider().should('not.be.visible');
  });

  it('handles overlay click', () => {
    cy.visit('/spectrum');
    cy.get('[data-cy="thread-card"]')
      .first()
      .click();
    threadSlider().should('be.visible');
    cy.url(
      'eq',
      'http://localhost:3000/spectrum/private/yet-another-thread~thread-6'
    );

    cy.get('[data-cy="overlay"]').click(200, 200, { force: true });

    communityBeforeUrlIsValid();
    threadSlider().should('not.be.visible');
  });

  it('handles close click', () => {
    cy.visit('/spectrum');
    cy.get('[data-cy="thread-card"]')
      .first()
      .click();
    threadSlider().should('be.visible');
    cy.url(
      'eq',
      'http://localhost:3000/spectrum/private/yet-another-thread~thread-6'
    );

    threadSliderClose().click();

    communityBeforeUrlIsValid();
    threadSlider().should('not.be.visible');
  });

  it('handles channel feed', () => {
    cy.visit('/spectrum/general');
    cy.get('[data-cy="thread-card"]')
      .first()
      .click();
    threadSlider().should('be.visible');
    cy.url(
      'eq',
      'http://localhost:3000/spectrum/spectrum/general/yet-another-thread~thread-9'
    );

    pressEscape();

    channelBeforeUrlIsValid();
    threadSlider().should('not.be.visible');
  });

  it('handles thread attachment', () => {
    cy.auth(user.id);
    cy.visit('/spectrum/private/yet-another-thread~thread-6');
    cy.get('[data-cy="thread-attachment"]')
      .should('be.visible')
      .first()
      .click();
    threadSlider().should('be.visible');
    pressEscape();
    cy.url(
      'eq',
      'http://localhost:3000/spectrum/private/yet-another-thread~thread-6'
    );
  });
});
