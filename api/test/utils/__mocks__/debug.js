// @flow

const loggers = {};

function makeLogger() {
  function logger(...args: any[]) {
    logger.log.push(args.join(' '));
  }
  logger.log = [];
  return logger;
}

module.exports = (namespace: string) => {
  return (loggers[namespace] = loggers[namespace] || makeLogger());
};
