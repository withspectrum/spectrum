# Testing

We use [Jest](https://facebook.github.io/jest/) for testing. (we recommend reading through the documentation, since it has a lot of great features you might not expect) Most of our tests are "e2e". That's in quotes because with GraphQL "e2e" tests don't do any network request, they still hit our database though and all that. (which is awesome since it's much faster!)

We create a separate database for testing (called `"testing"`, surprisingly) that gets populated with some test data that we then verify against. A typical test suite for a certain type might look like this:

```javascript
import { graphql } from 'graphql';
import createLoaders from '../loaders';
import schema from '../schema';

// Nice little helper function for tests
const request = query =>
  graphql(schema, query, undefined, { loaders: createLoaders() });

describe('queries', () => {
  it('should fetch a user', () => {
    // Define your query
    const query = /* GraphQL */ `
      {
        user(id: "gVk5mYwccUOEKiN5vtOouqroGKo1") {
          name
          username
          profilePhoto
        }
      }
    `;

    // Make sure the assertion below is called and we don't run into a race condition
    expect.assertions(1);
    // Return the Promise returned from the request
    return request(query).then(result => {
      // Use Jest snapshot testing for neater tests and easier diffs
      expect(result).toMatchSnapshot();
    });
  });
})
```
