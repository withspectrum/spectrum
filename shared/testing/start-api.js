const respawn = require('respawn');

const monitor = respawn(['yarn', 'run', 'dev:api'], {
  env: {
    TEST_DB: true,
  },
  cwd: process.cwd(),
  name: 'api',
});

monitor.on('stdout', buffer => process.stdout.write(buffer));
monitor.on('stderr', buffer => process.stderr.write(buffer));

monitor.start();
