const { execSync } = require('child_process');
const path = require('path');
const parse = require('./utils/parse-argv');
const error = require('./utils/error');

// Debug util
const exec = process.env.DEBUG
  ? cmd => {
      console.log(`[DEBUG] ${cmd}`);
    }
  : execSync;
// Append --team space-program to all now commands
const now = (cmd = '') => `now ${cmd} --team space-program`;

const VALID_SERVERS = [
  'all',
  'analytics',
  'api',
  'athena',
  'chronos',
  'hermes',
  'hyperion',
  'mercury',
  'vulcan',
];
const VALID_ALPHA_SERVERS = ['api', 'hyperion'];
const { args, flags } = parse(process.argv);

let servers = args;

if (servers.length === 0)
  error(
    'Server name missing',
    `Please provide one of the following server names: ${VALID_SERVERS.map(
      w => `"${w}"`
    ).join(', ')}`
  );

servers.forEach(server => {
  if (VALID_SERVERS.indexOf(server) === -1)
    error(
      `Cannot deploy unknown server "${args[0]}"`,
      `Please provide one of the following server names: ${VALID_SERVERS.map(
        w => `"${w}"`
      ).join(', ')}`
    );
});

if (flags.prod && servers.indexOf('all') > -1) {
  servers = VALID_SERVERS.filter(w => w !== 'all');
} else if (servers.indexOf('all') > -1) {
  servers = VALID_ALPHA_SERVERS;
}

if (!flags.prod) {
  servers.forEach(server => {
    if (VALID_ALPHA_SERVERS.indexOf(server) === -1) {
      error(
        `Cannot deploy ${server} to alpha`,
        'Did you mean to use the "--prod" flag?'
      );
    }
  });
  servers = servers.filter(server => VALID_ALPHA_SERVERS.indexOf(server) > -1);
}

console.log(`\nDeploying to ${flags.prod ? 'production' : 'alpha'}!\n`);

// Hyperion needs to be deployed especially
if (servers.indexOf('hyperion') > -1) {
  servers = servers.filter(w => w !== 'hyperion');
  console.log(`\n---hyperion---`);
  console.log(`Deploying hyperion`);
  exec(now(), {
    stdio: 'inherit',
  });

  const alias = `hyperion.${flags.prod ? 'workers' : 'alpha'}.spectrum.chat`;
  console.log(`Aliasing to ${alias}`);
  try {
    exec(now(`alias ${alias}`), {
      stdio: 'inherit',
    });
  } catch (err) {
    console.log('ALIAS FAILED!');
    console.log(err);
  }

  console.log('Clearing cache');
  exec(
    now(
      `alias -r rules${!flags.prod ? '-alpha' : ''}.json ${
        !flags.prod ? 'alpha.' : ''
      }spectrum.chat`
    ),
    {
      stdio: 'inherit',
    }
  );
  console.log('hyperion is live!\n');
}

if (servers.length > 0) {
  console.log('Installing fresh dependencies...');
  exec('yarn');
  servers.forEach(server => {
    const buildDir = path.join(__dirname, `../build-${server}`);
    console.log(`\n---${server}---`);
    console.log(`Installing ${server} dependencies...`);
    exec('yarn', {
      cwd: path.join(__dirname, `../${server}`),
    });
    console.log(`Building ${server}...`);
    exec(`yarn run build:${server}`);

    console.log(`Deploying ${server}...`);
    const stdout = exec(now(`build-${server}`), {
      stdio: 'pipe',
    });

    const alias =
      server === 'api'
        ? `api.${!flags.prod ? 'alpha.' : ''}spectrum.chat`
        : `${server}.${
            flags.prod === true ? 'workers' : 'alpha'
          }.spectrum.chat`;
    console.log(`Aliasing ${stdout.toString()} to ${alias}...`);
    exec(now(`alias ${stdout.toString()} ${alias}`), {
      cwd: buildDir,
      stdio: 'inherit',
    });

    console.log(`${server} is live!\n`);
  });
}
