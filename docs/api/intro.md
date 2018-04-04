[Table of contents](../readme.md)

# API

The Spectrum API is a Node.js web server based on Express.js and GraphQL. It's also houses a websocket server for all of our subscription needs.

## Structure

This server follows a GraphQL-first philosophy. That means we design the GraphQL schema first and then start implementing business logic. This is great because it gives us a clear separation of concerns (business logic vs. schema), and it's how Facebook recommends to use GraphQL.

## GraphQL
- [Intro](graphql/intro.md)
  - [Fragments](graphql/fragments.md)
  - [Pagination](graphql/pagination.md)
  - [Testing](graphql/testing.md)
  - [Tips & Tricks](graphql/tips-and-tricks.md)