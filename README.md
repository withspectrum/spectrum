<div align="center">

  [![Spectrum](./public/img/media.png)](https://spectrum.chat)

  ### Simple, powerful online communities.
  
</div>

----

This is the main monorepo codebase of [Spectrum](https://spectrum.chat). Every single line of code that's not packaged into a library is in this repository.

*[Click here for more information about Spectrum](https://spectrum.chat)*

## Contributing 

**We heartily welcome any and all contributions that match our product roadmap and engineering standards!**

That being said, this codebase isn't your typical open source project because it's not a library or package with a limited scope—it's our entire product.

### Ground Rules

#### Reporting a bug or discussing a feature idea

If you found a technical bug on Spectrum or have ideas for features we should implement this issue tracker is the best place to put them. Make sure to follow the issue template and you should be golden! ([click here to open a new issue](https://github.com/withspectrum/spectrum/issues/new))

#### Fixing a bug or implementing a new feature

If you find a bug on Spectrum and open a PR that fixes it we'll likely merge it given it matches our engineering standards. If you want implement a new feature, open an issue first to discuss what it'd look like and to ensure it fits in our roadmap and plans for the app. (we'll likely close a PR implementing a feature that wasn't explicitly whitelisted as something we want)

Want to fix a bug or implement an agreed-upon feature? Great, jump to the [local setup instructions](#first-time-setup)!

### Codebase

- [Technologies](#technologies)
- [Folder structure](#folder-structure)
- [First time setup](#first-time-setup)
- [Running the app locally](#running-the-app-locally)

#### Technologies

With the ground rules out of the way, let's talk about the coarse architecture of this mono repo:

- **Full-stack JavaScript**: We use Node.js to power our servers, and React to power our frontend and mobile apps. Almost all of the code you'll touch in this codebase will be JavaScript.
- **Background Jobs**: We leverage background jobs (powered by [`bull`](https://github.com/OptimalBits/bull) and Redis) a lot. These jobs are handled by a handful of small worker servers, each with its own purpose.

Here is a list of all the big technologies we use:

- **RethinkDB**: Data storage
- **Redis**: Background jobs and caching
- **GraphQL**: API, powered by the entire Apollo toolchain
- **PassportJS**: Authentication
- **React**: Frontend and mobile apps
- **Expo**: Mobile apps
- **DraftJS**: WYSIWYG writing experience on the web

#### Folder structure

```sh
spectrum/
├── athena     # Worker server (notifications and general processing)
├── chronos    # Worker server (cron jobs)
├── docs
├── email-templates
├── hermes     # Worker server (email sending)
├── hyperion   # Server rendering server
├── iris       # API server
├── mercury    # Worker server (reputation)
├── mobile     # Mobile apps
├── pluto      # Worker server (payments; syncing with Stripe)
├── public     # Public files used on the frontend
├── shared     # Shared JavaScript code
├── src        # Frontend SPA
└── vulcan     # Worker server (search indexing; syncing with Algolia)
```

<details>
  <summary>Click to learn about the worker naming scheme</summary>

#### Naming Scheme

As you can see we follow a loose naming scheme based on ancient Greek, Roman, and philosophical figures that are somewhat related to what our servers do:

- Iris (/ˈaɪrᵻs/) is one of the goddesses of the sea and the sky and was the messenger of the gods during the Titanomachy. (the battle between the titans and the gods)
- Hyperion: (/haɪˈpɪəriən/) is one of the twelve Titan children of Gaia and Uranus.
- Athena (/əˈθiːnə/) is the goddess of wisdom, craft, and war.
- Hermes (/ˈhɜːrmiːz/) is the messenger god, moving between the worlds of the mortal and the divine.
- Chronos (/ˈkroʊnɒs/) is the personification of Time in pre-Socratic philosophy
- Mercury (/ˈmɜːrkjʊri/) is the patron god of financial gain, commerce, eloquence (and thus poetry), messages/communication (including divination), travelers, boundaries, luck, trickery and thieves

</details>

<br />

#### First time setup

The first step to running Spectrum locally is downloading the code by cloning the repository:

```sh
git clone git@github.com:withspectrum/spectrum.git
```

##### Installation

Spectrum has four big installation steps:

1. **Install RethinkDB**: See [the RethinkDB documentation](https://rethinkdb.com/docs/install/) for instructions on installing it with your OS.
2. **Install Redis**: See [the Redis documentation](https://redis.io/download) for instructions on installing it with your OS.
3. **Install yarn**: We use [yarn](https://yarnpkg.com) to handle our JavaScript dependencies. (plain `npm` doesn't work due to our monorepo setup) See [the yarn documentation](https://yarnpkg.com/en/docs/install) for instructions on installing it.

Once you have RethinkDB, Redis and yarn installed locally its time to install the JavaScript dependencies. To install all necessary dependencies for the frontend and for `iris` (the web server) run this in the root of the project:

```sh
yarn install
```

To install the dependencies for `athena`, `hermes`, `chronos`, `mercury` and `vulcan`:

```sh
# Hermes
cd hermes
yarn install
cd ..
# Athena
cd athena
yarn install
cd ..
# Chronos
cd chronos
yarn install
cd ..
# Mercury
cd mercury
yarn install
cd ..
# Hyperion
cd hyperion 
yarn install
cd ..
# Vulcan
cd vulcan
yarn install
cd ..
```

> Note: Yes we know it's very tedious to install the dependencies for every single folder manually-unfortunately `now` (our deployment service) doesn't support monorepos very well yet so we have to make due with this.

##### Migrating the database

When you first download the code and want to run it locally you have to migrate the database and seed it with test data. First, start rethinkdb in its own terminal tab:

```sh
rethinkdb
```

Then, in a new tab, run these commands:

```sh
yarn run db:migrate
yarn run db:seed
# ⚠️ To empty the database (e.g. if there's faulty data) run yarn run db:drop
```

#### Running the app locally

##### Background services

Whenever you want to run Spectrum locally you have to have RethinkDB and Redis running in the background. First start rethinkdb like we did to migrate the database:

```sh
rethinkdb
```

Then (without closing the rethinkdb tab!) open another tab and start Redis:

```sh
redis-server
```

##### Start the servers

Depending on what you're trying to work on you'll need to start different servers. Generally, all servers run in development mode by doing `yarn run dev:<workername>`, e.g. `yarn run dev:hermes` to start the email worker.

No matter what you're trying to do though, you'll want to have the API (iris) running, so start that in a background tab:

```
yarn run dev:iris
```

##### Develop the web UI

To develop the frontend and web UI run 

```
yarn run dev:web
```

##### Develop the mobile apps

To start the mobile apps run:

```
yarn run dev:mobile
```

And then open either the iOS simulator or the Android simulator with 

```sh
yarn run open:ios 
# or
yarn run open:android 
```

Refer to [the Expo documentation on how to install the simulators](https://docs.expo.io/versions/v25.0.0/guides/debugging.html#using-a-simulator--emulator).

> Note: If something didn't work or you ran into troubles please submit PRs to improve this doc and keep it up to date!
