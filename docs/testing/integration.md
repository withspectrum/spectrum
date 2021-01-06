[Table of contents](../readme.md) / [Testing](./intro.md)

# Integration tests

We use [Cypress](https://cypress.io) to run our integration tests, which gives you a nice GUI that you can use for your test runs. To run integration tests you have to have the api running in production mode and connected to the test database and the client running.

```sh
# First, build the API
yarn run build:api
# Then, in one tab start the API in test mode
yarn run start:api:test
# In another tab start the web client
yarn run dev:web
```

Then open the Cypress GUI and you're good to start running the integration tests:

```sh
yarn run cypress:open
```

### Writing integration tests

**It is highly recommend to read the [Best Practices section of the Cypress docs](https://docs.cypress.io/guides/references/best-practices.html) before starting to write them!**

All our integration tests live in `cypress/integration/`. This is what a normal integration test might look like:

```JS
// cypress/integration/home_spec.js
describe('Home View', () => {
  before(() => {
    cy.visit('/');
  });

  it('should render the home page', () => {
    cy.get('[data-cy="home-page"]').should('be.visible');
    cy.get('[href*="/login"]').should('be.visible');
  });
});
```

Note that while the Cypress API looks synchronous, it's actually totally asynchronous under the hood. They build up a queue of incoming assertions and wait for them to happen in order. While that's a bit confusing at the beginning, you get used to it very fast.

Also note that Cypress uses Mocha under the hood, where our unit tests use Jest. This means rather than `expect().toEqual()` you'd have to write `expect().to.equal()` due to the syntax difference between the `expect` implementations.

### Test IDs

To verify that certain elements are or aren't on the page we use custom `data-cy` attributes. You render them from React like so:

```JS
class HomePage extends Component {
  render() {
    return (
      <Wrapper data-cy="home-page">
        {/*...*/}
      </Wrapper>
    )
  }
}
```

Then you can make sure the splash page rendered correctly by waiting for that selector to appear on the page:

```JS
// cypress/integration/home_spec.js
it('should render', () => {
  cy.get('[data-cy="home-page"]').should('be.visible');
});
```

