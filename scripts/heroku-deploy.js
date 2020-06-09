const { execSync } = require('child_process');
const error = require('./utils/error');
const parse = require('./utils/parse-argv');
const path = require('path');

const exec = cmd =>
  execSync(cmd, { cwd: path.join(__dirname, '../'), stdio: 'inherit' });

const { args } = parse(process.argv);

const VALID_SERVERS = [
  'all',
  'api',
  'athena',
  'chronos',
  'hermes',
  'hyperion',
  'mercury',
  'vulcan',
];

const serverType = s => (['api', 'hyperion'].includes(s) ? 'web' : 'worker');

let servers = args;

/*
 * Must provide at least one server
 */
if (servers.length === 0)
  error(
    'Server name missing',
    `Please provide one of the following server names: ${VALID_SERVERS.map(
      s => `"${s}"`
    ).join(', ')}`
  );

/*
 * Must provide valid server names
 */
servers.forEach(s => {
  if (VALID_SERVERS.indexOf(s) === -1)
    error(
      `Cannot deploy unknown server "${args[0]}"`,
      `Please provide one of the following server names: ${VALID_SERVERS.map(
        s => `"${s}"`
      ).join(', ')}`
    );
});

/*
 * Allow targetting all deployments
 */
if (servers.indexOf('all') > -1) {
  servers = VALID_SERVERS.filter(s => s !== 'all');
}

console.log(
  `Deploying the following servers: ${servers.map(s => `"${s}"`).join(', ')}`
);

/*
 * Build and push Docker images for each server
 */
servers.forEach(s => {
  const type = serverType(s);

  exec(
    `docker build -t spectrum_${s} -t registry.heroku.com/spectrum-chat-${s}/${type} -f docker/Dockerfile.${s} .`
  );

  exec(`docker push registry.heroku.com/spectrum-chat-${s}/${type}`);
});

/*
 * Release new images for each server
 */
servers.forEach(s => {
  exec(`heroku container:release ${serverType(s)} -a spectrum-chat-${s}`);
});
