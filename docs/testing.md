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

## CI

On CI we run `yarn run test:ci`, which forces Jest to exit after running the tests. You can also run this command locally in case you're in the mood to do a full test run rather than going into watch mode.

