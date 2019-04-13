// Cheap process.argv parser
module.exports = argv => {
  const processArgs = argv.slice(2);
  const args = processArgs.filter(arg => arg.indexOf('--') !== 0);
  const flags = processArgs
    .filter(arg => arg.indexOf('--') === 0)
    .reduce((flags, flag) => {
      flags[flag.replace(/^--/, '')] = true;
      return flags;
    }, {});

  return { args, flags };
};
