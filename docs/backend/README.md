# Backend

The backend of Spectrum.chat is built on RethinkDB (data storage) and Redis. (background job queue) There are currently three parts to it:

- Iris: A Node.js server based on Express.js and GraphQL.
- Athena: A Node.js worker for background job processing. (mainly notifications)
- Hermes: A Node.js worker for sending emails.

Each one of these can be run and developed independently with matching `npm run dev:x` and `npm run build:x` commands. (where `x` is the name of the server)
