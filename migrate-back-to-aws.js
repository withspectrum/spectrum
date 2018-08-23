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
  console.log('Getting channelSettings...');
  const channelSettings = await dbs.compose
    .table('channelSettings')
    .filter(dbs.compose.row('createdAt').gt(DATE))
    .run()
    .catch(err => {
      throw new Error(err);
      process.exit(1);
    });
  console.log('Getting communitySettings...');
  const communitySettings = await dbs.compose
    .table('communitySettings')
    .filter(dbs.compose.row('createdAt').gt(DATE))
    .run()
    .catch(err => {
      throw new Error(err);
      process.exit(1);
    });
  console.log('Getting directMessageThreads...');
  const directMessageThreads = await dbs.compose
    .table('directMessageThreads')
    .filter(dbs.compose.row('createdAt').gt(DATE))
    .run()
    .catch(err => {
      throw new Error(err);
      process.exit(1);
    });
  console.log('Getting slackImports...');
  const slackImports = await dbs.compose
    .table('slackImports')
    .filter(dbs.compose.row('createdAt').gt(DATE))
    .run()
    .catch(err => {
      throw new Error(err);
      process.exit(1);
    });
  console.log('Getting threads...');
  const threads = await dbs.compose
    .table('threads')
    .filter(dbs.compose.row('createdAt').gt(DATE))
    .run()
    .catch(err => {
      throw new Error(err);
      process.exit(1);
    });
  console.log('Getting messages...');
  const messages = await dbs.compose
    .table('messages')
    .filter(dbs.compose.row('createdAt').gt(DATE))
    .run()
    .catch(err => {
      throw new Error(err);
      process.exit(1);
    });
  console.log('Getting communities...');
  const communities = await dbs.compose
    .table('communities')
    .filter(dbs.compose.row('createdAt').gt(DATE))
    .run()
    .catch(err => {
      throw new Error(err);
      process.exit(1);
    });
  console.log('Getting channels...');
  const channels = await dbs.compose
    .table('channels')
    .filter(dbs.compose.row('createdAt').gt(DATE))
    .run()
    .catch(err => {
      throw new Error(err);
      process.exit(1);
    });
  console.log('Getting threadReactions...');
  const threadReactions = await dbs.compose
    .table('threadReactions')
    .filter(dbs.compose.row('createdAt').gt(DATE))
    .run()
    .catch(err => {
      throw new Error(err);
      process.exit(1);
    });
  console.log('Getting reactions...');
  const reactions = await dbs.compose
    .table('reactions')
    .filter(dbs.compose.row('createdAt').gt(DATE))
    .run()
    .catch(err => {
      throw new Error(err);
      process.exit(1);
    });
  console.log('Getting users...');
  const users = await dbs.compose
    .table('users')
    .filter(dbs.compose.row('createdAt').gt(DATE))
    .run()
    .catch(err => {
      throw new Error(err);
      process.exit(1);
    });
  console.log('Getting usersSettings...');
  const usersSettings = await dbs.compose
    .table('usersSettings')
    .filter(dbs.compose.row('createdAt').gt(DATE))
    .run()
    .catch(err => {
      throw new Error(err);
      process.exit(1);
    });
  console.log('Getting usersCommuniteis...');
  const usersCommunities = await dbs.compose
    .table('usersCommunities')
    .filter(dbs.compose.row('createdAt').gt(DATE))
    .run()
    .catch(err => {
      throw new Error(err);
      process.exit(1);
    });
  console.log('Getting usersChannels...');
  const usersChannels = await dbs.compose
    .table('usersChannels')
    .filter(dbs.compose.row('createdAt').gt(DATE))
    .run()
    .catch(err => {
      throw new Error(err);
      process.exit(1);
    });
  console.log('Getting usersThreads...');
  const usersThreads = await dbs.compose
    .table('usersThreads')
    .filter(dbs.compose.row('createdAt').gt(DATE))
    .run()
    .catch(err => {
      throw new Error(err);
      process.exit(1);
    });

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

try {
  (async () => {
    console.log(
      'Getting all new data from Compose since',
      DATE.toLocaleString()
    );
    try {
      const data = await getNewData().catch(err => {
        throw new Error(err);
        process.exit(1);
      });
      Object.keys(data).forEach(table => {
        console.log(`${table}: ${data[table].length} new records`);
      });
      // await insertNewData(data);
    } catch (err) {
      throw new Error(err);
      process.exit(1);
    }
  })();
} catch (err) {
  throw new Error(err);
  process.exit(1);
}
