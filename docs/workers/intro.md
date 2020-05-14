[Table of contents](../readme.md)

# Workers

Our asynchronos background job processing is powered by a series of worker servers.

- [Athena](athena/intro.md): processes notifications
- [Chronos](chronos/intro.md): processes cron jobs
- [Hermes](hermes/intro.md): sends emails
- [Mercury](mercury/intro.md): processes reputation events
- [Vulcan](vulcan/intro.md): indexes content for search

Each one of these can be run and developed independently with matching `npm run dev:x` and `npm run build:x` commands. (where `x` is the name of the server)

### Naming scheme

As you can see we follow a loose naming scheme based on ancient Greek, Roman, and philosophical figures that are somewhat related to what our servers do:

- Athena (/əˈθiːnə/) is the goddess of wisdom, craft, and war.
- Chronos (/ˈkroʊnɒs/) is the personification of Time in pre-Socratic philosophy
- Hermes (/ˈhɜːrmiːz/) is the messenger god, moving between the worlds of the mortal and the divine.
- Mercury (/ˈmɜːrkjʊri/) is the patron god of financial gain, commerce, eloquence (and thus poetry), messages/communication (including divination), travelers, boundaries, luck, trickery and thieves
- Vulcan is the god of fire, including the fire of volcanoes, metalworking, and the forge.

### Background jobs

Many of our workers run off of our [Redis queue](background-jobs.md) to handle asynchronous events.

[Learn more about background jobs](background-jobs.md)
