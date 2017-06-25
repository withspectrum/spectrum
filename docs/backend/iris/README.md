# `iris`: The web server

Iris is a Node.js web server based on Express.js and GraphQL.

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
