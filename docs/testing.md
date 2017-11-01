# Testing

We use [`Jest`](https://github.com/facebook/jest) for all our testing needs.

## Workflow

To run Jest in watch mode locally so the tests run automatically while you're developing run:

```sh
yarn run test
```

Before running the tests this will set up a RethinkDB database locally called `"testing"`. It will run the migrations over it and then insert some dummy data.

This is important because we test our GraphQL API against the real database, we don't mock anything, to make sure everything is working 100%.

When you exit the testing process with `CTRL+C` it will clean the database from all its data. It leaves the migrations in tact though, since there's no reason we should have to run them everytime we run the test suite.

### Stale data

In edge cases it could happen that you end up with bad data locally and that tests fail/pass even though they shouldn't. To get rid of the stale data just stop the testing process and optionally run `yarn run posttest` to make extra sure there's nothing in the database anymore, before restarting the testing process to start from a clean slate.

### End-to-end tests

To run e2e tests locally you have to have both iris and the client running. You also need Iris to be connected to the test database, which you do by setting `TEST_DB`:

```sh
TEST_DB=true yarn run dev:iris
```

Then, with both client and iris connected to the test database running, to run the full test suite including e2e tests:

```sh
E2E=true yarn run test
```

This automatically happens in CI, so you can't introduce a failing tests and expect builds to go through.

#### End-to-end test ids

To verify that certain elements are or aren't on the page we use custom `data-e2e-id` attributes. You render them from React like so:

```JS
class SplashPage extends Component {
  render() {
    return (
      <Wrapper data-e2e-id="splash-page">
        {/*...*/}
      </Wrapper>
    )
  }
}
```

Then from puppeteer (which we use for e2e tests) you can make sure the splash page rendered correctly by waiting for that selector to appear on the page:

```JS
it('should render', async () => {
  await page.goto('http://localhost:3000/');
  await page.waitForSelector('[data-e2e-id="splash-page"]');
})
```

## CI

On CI we run `yarn run test:ci`, which forces Jest to exit after running the tests. You can also run this command locally in case you're in the mood to do a full test run rather than going into watch mode.

