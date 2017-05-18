# Spectrum Server

A Node.js server for Spectrum.chat, built with Express.js, GraphQL and RethinkDB.

## Setup

```sh
# Install RethinkDB (note, you only need to do this one time)
brew install rethinkdb
# Start rethinkdb
rethinkdb
# In a separate tab migrate the database
yarn run db:migrate
# Then seed it with some initial data
yarn run db:seed
# ⚠️ To empty the database (e.g. if there's faulty data) run yarn run db:drop
# Start the server in development mode (restarts on any change)
yarn run dev:server
# To start the server in production mode do yarn run start:server
```

## Structure

This server follows a GraphQL-first philosophy. That means we design the GraphQL schema first and then start implementing business logic. This is great because it gives us a clear separation of concerns (business logic vs. schema), and it's how Facebook recommends to use GraphQL.

We use [`graphql-tools`](http://dev.apollodata.com/tools/graphql-tools/index.html) which lets us use the GraphQL schema language to design our schema. This schema written in the schema language is then combined with our resolvers (which live somewhere else) using `graphql-tools`, which outputs our finished schema that's then used.

### Folder Setup

This folder setup was inspired by a bunch of open (and some closed) source projects @mxstbr looked at before embarking on the journey of building this. It seems to work well, even for big projects, but nothing here is set in stone and we're always open for new ideas and discussions.

This is the current folder structure annotated:

```sh
server/
├── migrations     # Migrations for seeding the database with some initial data
├── models         # Handle talking to the database
├── mutations      # Mutation     resolvers
├── queries        # Query        resolvers
├── subscriptions  # Subscription resolvers
├── types          # The schema, split up into many smaller parts
│   └── scalars.js # The custom scalars we use in our schema and their resolvers
├── README.md
├── index.js       # Runs the actual servers (GraphQL + WebSocket for subscriptions)
└── schema.js      # Combines the types from types/ and the resolvers together with graphql-tools
```

## Things to note

### Keep resolvers as small as possible

What we mean by this is that resolvers should (for the most part) only be a mapping between a certain path and the model function that takes care of it. Make sure the least amount of business logic possible lives in resolvers. (these are reminiscent of Controllers in a traditional MVC setup)

### Pagination

We have a standard way to paginate resources based on the [Relay Connections Specification](https://facebook.github.io/relay/graphql/connections.htm). Rather than reading a spec that might not make any pratical sense we recommend reading these two article to get a grasp of the why and how:

- [Understanding pagination: REST, GraphQL and Relay](https://dev-blog.apollodata.com/understanding-pagination-rest-graphql-and-relay-b10f835549e7): Get a sense of the issues we're facing with the app and how to solve them
- [Explaining GraphQL Connections](https://dev-blog.apollodata.com/explaining-graphql-connections-c48b7c3d6976): We follow this specific structure to the dot. (with one tiny change in naming)

The TL;DR of how to use it is:

```GraphQL
{
  thread(id: "some-thread-id") {
    # Fetch the messages of a certain thread
    messageConnection {
      pageInfo {
        # Do we have another page to fetch after this
        hasNextPage
      }
      edges {
        # Pass the cursor of the last message to messageConnections
        # to fetch the next page
        cursor
        # The actual message:
        node {
          id
          message {
            content
          }
        }
      }
    }
  }
}
```

This query would get the first 10 (or less) messages of that thread. To get the next page you have to take the `cursor` of the last message edge and pass that to messageConnections:

```GraphQL
{
  thread(id: "some-thread-id") {
    # Fetch the next messages after the last message in the thread
    messageConnection(after: $lastMessageCursor) {
      edges {
        node {
          message {
            content
          }
        }
      }
    }
  }
}
```

> Note: The cursor is an opaque data structure, meaning it might refer to something you understand or it might not. It's also not promised to be consistent, especially between sessions, resources, etc. This boils down to **do not use the cursor for anything other than passing it to the query for the next page**, no matter if you want to use it for something else.

To specify how many messages you want to load use the `first` parameter:

```GraphQL
{
  thread(id: "some-thread-id") {
    # Fetch the first 5 messages after the last message
    messageConnection(first: 5, after: $lastMessageCursor) {
      edges {
        node {
          message {
            content
          }
        }
      }
    }
  }
}
```

> Note: The default for `first` is normally 10, but might be changed depending on the resource being fetched. Make sure to check GraphiQL/the types to figure out what the default is.

#### Naming

Connections and edges have standard names and structures across all resources:

```GraphQL
# A connection of a thread to messages
type ThreadMessagesConnection {
  pageInfo: PageInfo!
  edges: [ThreadMessageEdge!]
}

# An edge from a thread to a message
type ThreadMessageEdge {
  cursor: String!
  node: Message!
}

type Thread {
  messageConnection(first: Int = 10, after: String): ThreadMessagesConnection!
}
```

> Note: This is where we diverge slightly from the article linked above, it recommends naming your edges in plural (`ThreadMessagesEdge`) to make it consistent with the connection but we've found that the singular (`ThreadMessageEdge`) makes it clear only a single resource is being fetched and think that's more important.

### Error management

We use [`graphql-errors`](https://github.com/kadirahq/graphql-errors) to mask internal errors in production. (GraphQL schema errors are still visible of course) Instead of seeing "Database limit exceeded, please upgrade your account xyz.", the user only sees "Internal Error: asdf123-asdf-asdf-asdf1235" (where `"asdf123-asdf-asdf-asdf1235"` is a UUID that helps us reference that error to a stacktrace) which means no sensitive information is leaked.

Sometimes you want to show the user an error though, for example for permissions. In that case you have to use the `UserError` from `graphql-errors`, which will not be masked:

```JS
const { UserError } = require('graphql-errors');

// The user will see this full error message
throw new UserError('You do not have permission to access field xyz!')
```

### Testing

We use [Jest](https://facebook.github.io/jest/) for testing. (we recommend reading through the documentation, since it has a lot of great features you might not expect) Most of our tests are "e2e". That's in quotes because with GraphQL "e2e" tests don't do any network request, they still hit our database though and all that. (which is awesome since it's much faster!)

We create a separate database for testing (called `"testing"`, surprisingly) that gets populated with some test data that we then verify against. A typical test suite for a certain type might look like this:

```JS
import { graphql } from 'graphql';
import { db as mockTestDb, setup, teardown, data } from './db';

// Mock the database to refer to our testing database
// Note: The variable we mock it with has to have the mock- prefix,
// otherwise Jest compains.
jest.mock('../models/db', () => ({
  db: mockTestDb,
}));

import schema from '../schema';

describe('queries', () => {
  // Before all tests create the database and tables and insert the test data
  beforeAll(() => setup(mockTestDb));
  // After the tests are finished drop the database to restore a clean state
  afterAll(() => teardown(mockTestDb));

  it('should fetch a user', () => {
    // Write your GraphQL query how you normally would
    const query = /* GraphQL */`
      {
        user(id: "first-user") {
          uid
          createdAt
          lastSeen
          photoURL
          displayName
          username
          email
        }
      }
    `;

    // Makes sure the test fails if the async callback below doesn't fire and expect() is never called
    expect.assertions(1);
    // Return your graphql() call, which goes, gets the data and returns a Promise
    return graphql(schema, query).then(result => {
      // Use snapshots to verify the returned JSON response
      expect(result.data.user).toMatchSnapshot();
    });
  });
});
```
