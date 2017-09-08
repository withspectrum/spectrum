# Setup

## Install RethinkDB

For MacOS we recommen installing RethinkDB with `homebrew`:

```sh
brew install rethinkdb
# Start RethinkDB at system startup automatically in the background
brew services add rethinkdb
```

For other OS' see [the RethinkDB documentation](https://rethinkdb.com/docs/install/) for information on how to install it on your machine.

## Installing Redis

On MacOS we (again) recommend installing Redis with `homebrew`:

```sh
brew install redis
# Start Redis at system startup automatically in the background
brew services add redis
```

For other OS' see [the Redis documentation](https://redis.io/download) for download instructions.

## Installing Node.js dependencies

To install all necessary dependencies for the frontend and for `iris` (the web server) run this in the root of the project:

```sh
npm install
```

To install the dependencies for `athena`, `hermes`, `chronos`, and `mercury`:

```sh
# Navigate to the hermes/ folder
cd hermes
# Install the dependencies
npm install
# Navigate back to the root folder
cd ..
# Navigate to the athena/ folder
cd athena
# Install the dependencies
npm install
# Navigate back to the root folder
cd ..
# Navigate to the chronos/ folder
cd chronos
# Install the dependencies
npm install
# Navigate back to the root folder
cd ..
# Navigate to the mercury/ folder
cd mercury
# Install the dependencies
npm install
# Navigate back to the root folder
cd ..
```

## Database

Once you have RethinkDB and all the Node dependencies installed you can get your local database setup. To do this, start rethinkdb in one terminal tab:

```sh
rethinkdb
```

> Note: If you installed rethinkdb with `homebrew` on Mac and ran `brew services add` you don't need to do this.

Then (without closing the rethinkdb tab!) open another tab and run these commands:

```sh
# Migrate the database
yarn run db:migrate
# Seed it with some initial data
yarn run db:seed
# ⚠️ To empty the database (e.g. if there's faulty data) run yarn run db:drop
```

Now you should be all set up and ready to go! :tada:

> If something didn't work or you ran into troubles please submit PRs to improve this doc and keep it up to date!
