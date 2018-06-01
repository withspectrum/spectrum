import data from '../../shared/testing/data';

const user = data.users[0];

const coreSplashPageNavbarLinksVisible = () => {
  cy.get('[data-cy="navbar-splash"]').should('be.visible');

  cy.get('[data-cy="navbar-splash-features"]').should('be.visible');

  cy.get('[data-cy="navbar-splash-apps"]').should('be.visible');

  cy.get('[data-cy="navbar-splash-pricing"]').should('be.visible');

  cy.get('[data-cy="navbar-splash-support"]').should('be.visible');
};

const checkSignedOutSplashNavbarLinksRender = () => {
  coreSplashPageNavbarLinksVisible();

  cy.get('[data-cy="navbar-splash-signin"]').should('be.visible');
};

const checkSignedInSplashNavbarLinksRender = () => {
  coreSplashPageNavbarLinksVisible();

  cy.get('[data-cy="navbar-splash-profile"]').should('be.visible');
};

const checkProductNavbarLinksRender = () => {
  cy.get('[data-cy="navbar"]').should('be.visible');

  cy.get('[data-cy="navbar-logo"]').should('be.visible');

  cy.get('[data-cy="navbar-home"]').should('be.visible');

  cy.get('[data-cy="navbar-messages"]').should('be.visible');

  cy.get('[data-cy="navbar-explore"]').should('be.visible');

  cy.get('[data-cy="navbar-notifications"]').should('be.visible');

  cy.get('[data-cy="navbar-profile"]').should('be.visible');
};

const checkSignedOutNavbarRenders = () => {
  cy.get('[data-cy="navbar"]').should('be.visible');

  cy.get('[data-cy="navbar-logo"]').should('be.visible');

  cy.get('[data-cy="navbar-explore"]').should('be.visible');

  cy.get('[data-cy="navbar-support"]').should('be.visible');

  cy.get('[data-cy="navbar-pricing"]').should('be.visible');
};

const checkSignedOutSplashNavbarRenders = () => {
  cy.visit('/pricing');
  checkSignedOutSplashNavbarLinksRender();

  cy.visit('/terms');
  checkSignedOutSplashNavbarLinksRender();

  cy.visit('/privacy');
  checkSignedOutSplashNavbarLinksRender();
};

const checkSignedInSplashNavbarRenders = () => {
  cy.visit('/about');
  checkSignedInSplashNavbarLinksRender();

  cy.visit('/pricing');
  checkSignedInSplashNavbarLinksRender();

  cy.visit('/features');
  checkSignedInSplashNavbarLinksRender();

  cy.visit('/support');
  checkSignedInSplashNavbarLinksRender();

  cy.visit('/faq');
  checkSignedInSplashNavbarLinksRender();

  cy.visit('/terms');
  checkSignedInSplashNavbarLinksRender();

  cy.visit('/privacy');
  checkSignedInSplashNavbarLinksRender();
};

describe('Navbar logged in', () => {
  beforeEach(() => {
    cy.auth(user.id);
    cy.visit(`/`);
  });

  it('should render product navbar', () => {
    checkProductNavbarLinksRender();
  });

  it('should make sure all product navbar links work on each view', () => {
    cy.visit('/messages');
    checkProductNavbarLinksRender();

    cy.visit('/explore');
    checkProductNavbarLinksRender();

    cy.visit('/notifications');
    checkProductNavbarLinksRender();

    cy.visit(`/users/${user.username}`);
    checkProductNavbarLinksRender();
  });

  it('should render splash navbar when viewing splash pages', () => {
    checkSignedInSplashNavbarRenders();
  });
});

describe('Navbar logged out', () => {
  beforeEach(() => {
    cy.visit(`/`);
  });

  it('should render splash page navbar', () => {
    checkSignedOutSplashNavbarLinksRender();
  });

  it('should make sure all splash page navbar links work', () => {
    checkSignedOutSplashNavbarRenders();
  });

  it('should render product navbar', () => {
    cy.visit('/spectrum');
    checkSignedOutNavbarRenders();
  });
});
