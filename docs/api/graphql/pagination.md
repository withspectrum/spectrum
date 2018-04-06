[Table of contents](../../readme.md) / [API](../intro.md) / [GraphQL](./intro.md)

# Pagination with GraphQL

Even though there is no specific built-in way to paginate GraphQL queries there is a quasi-standard that most people (including us) follow called [Relay Connections Specification](https://facebook.github.io/relay/graphql/connections.htm). Rather than reading a spec that might not help you in pratical applications we recommend reading these two article to get a grasp of the why and how:

- [Understanding pagination: REST, GraphQL and Relay](https://dev-blog.apollodata.com/understanding-pagination-rest-graphql-and-relay-b10f835549e7): Get a sense of the issues we're facing with the app and how to solve them
- [Explaining GraphQL Connections](https://dev-blog.apollodata.com/explaining-graphql-connections-c48b7c3d6976): We follow this specific structure to the dot. (with one tiny change in naming)

## TL;DR

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

This query would get the first 10 (or less if there's less in total) messages of that thread. To get the next page you have to take the `cursor` of the last message edge and pass that to messageConnections:

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

## Naming conventions

Connections and edges have standard names and structures across all resources:

```GraphQL
# A connection of a story to messages
type StoryMessagesConnection {
  pageInfo: PageInfo!
  edges: [StoryMessageEdge!]
}

# An edge from a story to a message
type StoryMessageEdge {
  cursor: String!
  node: Message!
}

type Story {
  messageConnection(first: Int = 10, after: String): StoryMessagesConnection!
}
```

> Note: This is where we diverge slightly from the article linked above, it recommends naming your edges in plural (`StoryMessagesEdge`) to make it consistent with the connection but we've found that the singular (`StoryMessageEdge`) makes it clear only a single resource is being fetched and think that's more important.
