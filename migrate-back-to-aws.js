/*
 * Migrate data back to AWS from Compose
 */
const fs = require('fs');
const path = require('path');
const rethinkdbdash = require('rethinkdbdash');

/*
 * Databas setup
 */
const DEFAULT_CONFIG = {
  db: 'spectrum',
  max: 500,
  buffer: 5,
  timeoutGb: 60 * 1000,
};

const COMPOSE_CONFIG = {
  password: process.env.COMPOSE_US_WEST_2_RETHINKDB_PASSWORD,
  user: 'admin',
  host: process.env.COMPOSE_US_WEST_2_RETHINKDB_URL,
  port: process.env.COMPOSE_US_WEST_2_RETHINKDB_PORT,
  ssl: {
    ca: fs.readFileSync(path.join(process.cwd(), 'cacert')),
  },
};

const AWS_CONFIG = {
  password: process.env.AWS_RETHINKDB_PASSWORD,
  host: process.env.AWS_RETHINKDB_URL,
  port: process.env.AWS_RETHINKDB_PORT,
};

const dbs = {
  compose: rethinkdbdash({
    ...DEFAULT_CONFIG,
    ...COMPOSE_CONFIG,
  }),
  aws: rethinkdbdash({
    ...DEFAULT_CONFIG,
    ...AWS_CONFIG,
  }),
};

/*
 * Get any new data from Compose
 */
const DATE = new Date(1534982052000);

async function getNewData() {
  const [
    threads,
    messages,
    communities,
    channels,
    threadReactions,
    reactions,
    usersCommunities,
    usersChannels,
    usersThreads,
  ] = await Promise.all([
    dbs.compose
      .table('channelSettings')
      .filter(r.row('createdAt').gt(DATE))
      .run(),
    dbs.compose
      .table('communitySettings')
      .filter(r.row('createdAt').gt(DATE))
      .run(),
    dbs.compose
      .table('directMessageThreads')
      .filter(r.row('createdAt').gt(DATE))
      .run(),
    dbs.compose
      .table('slackImports')
      .filter(r.row('createdAt').gt(DATE))
      .run(),
    dbs.compose
      .table('threads')
      .filter(r.row('createdAt').gt(DATE))
      .run(),
    dbs.compose
      .table('messages')
      .filter(r.row('timestamp').gt(DATE))
      .run(),
    dbs.compose
      .table('communities')
      .filter(r.row('createdAt').gt(DATE))
      .run(),
    dbs.compose
      .table('channels')
      .filter(r.row('createdAt').gt(DATE))
      .run(),
    dbs.compose
      .table('threadReactions')
      .filter(r.row('createdAt').gt(DATE))
      .run(),
    dbs.compose
      .table('reactions')
      .filter(r.row('createdAt').gt(DATE))
      .run(),
    dbs.compose
      .table('users')
      .filter(r.row('createdAt').gt(DATE))
      .run(),
    dbs.compose
      .table('usersSettings')
      .filter(r.row('createdAt').gt(DATE))
      .run(),
    dbs.compose
      .table('usersCommunities')
      .filter(r.row('createdAt').gt(DATE))
      .run(),
    dbs.compose
      .table('usersChannels')
      .filter(r.row('createdAt').gt(DATE))
      .run(),
    dbs.compose
      .table('usersThreads')
      .filter(r.row('createdAt').gt(DATE))
      .run(),
  ]);

  return {
    threads,
    messages,
    communities,
    channels,
    threadReactions,
    reactions,
    usersCommunities,
    usersChannels,
    usersThreads,
  };
}

/*
 * Insert missing data into AWS
 */
async function insertNewData(data) {
  await Promise.all(
    Object.keys(data).map(table => {
      return dbs.aws
        .table(table)
        .insert(data[table])
        .run();
    })
  );
}

async () => {
  const data = await getNewData();
  await insertNewData(data);
};
