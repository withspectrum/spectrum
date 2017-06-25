# Backend

The backend of Spectrum.chat is built on RethinkDB (data storage) and Redis. (background job queue) There are currently three parts to it:

- Iris: A Node.js server based on Express.js and GraphQL.
- Athena: A Node.js worker for background job processing. (mainly notifications)
- Hermes: A Node.js worker for sending emails.

Each one of these can be run and developed independently with matching `npm run dev:x` and `npm run build:x` commands. (where `x` is the name of the server)

## Naming scheme

As you can see we follow a loose naming scheme based on ancient greek gods that are somewhat related to what our servers do:

- Iris (/ˈaɪrᵻs/) is one of the goddesses of the sea and the sky and was the messenger of the gods during the Titanomachy. (the battle between the titans and the gods)
- Athena (/əˈθiːnə/) is the goddess of wisdom, craft, and war.
- Hermes (/ˈhɜːrmiːz/) is the messenger god, moving between the worlds of the mortal and the divine.
