# Testing

We have a test suite consisting of a bunch of unit tests (mostly for the API) and integration tests to verify Spectrum keeps working as expected. The entire test suite is run in CI for every commit and PR, so if you introduce a breaking change the CI will fail and the PR will not be merge-able.

## Unit tests

We use [`Jest`](https://github.com/facebook/jest) for our unit testing needs. To run Jest in watch mode locally so the tests run automatically while you're developing run:

```sh
yarn run test
```

Before running the tests this will set up a RethinkDB database locally called `"testing"`. It will run the migrations over it and then insert some dummy data. This is important because we test our GraphQL API against the real database, we don't mock anything, to make sure everything is working 100%.

When you exit the testing process with `CTRL+C` it will clean the database from all its data. It leaves the migrations in tact though, since there's no reason we should have to run them everytime we run the test suite.

### Stale data

In edge cases it could happen that you end up with bad data locally and that tests fail/pass even though they shouldn't. To get rid of the stale data just stop the testing process and optionally run `yarn run posttest` to make extra sure there's nothing in the database anymore, before restarting the testing process to start from a clean slate.

## End-to-end tests

We use [Cypress](https://cypress.io) to run our e2e tests, which gives you a nice GUI that you can use for your test runs. To run e2e tests you have to have both api and the client running. You also need API to be connected to the test database, which you do by setting `TEST_DB`:

```sh
# In one tab
TEST_DB=true yarn run dev:api
# In another tab
yarn run dev:web
```

Then open the Cypress GUI and you're good to start running the e2e tests:

```sh
yarn run cypress:open
```

### Writing e2e tests

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
    cy.get('[href*="/new/community"]').should('be.visible');
  });
});
```

Note that while the Cypress API looks synchronous, it's actually totally asynchronous under the hood. They build up a queue of incoming assertions and wait for them to happen in order. While that's a bit confusing at the beginning, you get used to it very fast.

Also note that Cypress uses Mocha under the hood, where our unit tests use Jest. This means rather than `expect().toEqual()` you'd have to write `expect().to.equal()` due to the syntax difference between the `expect` implementations.

#### Test IDs

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

