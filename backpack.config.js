const path = require('path');
const debug = require('debug')('build:backpack');

const dir = process.env.DIR;

if (!dir) throw new Error('Define directory to build with the -d option.');
debug(
  `> Building ${dir}, entry: ${dir}/index.js, output: build-${dir}/main.js`
);

// Make sure webpack transpiles files in the shared folder
const transpileShared = config => {
  config.module.rules.forEach(rule => {
    if (rule.loader.indexOf('/babel-loader/') === -1) return;
    rule.include = [
      path.resolve(__dirname, `./${dir}`),
      path.resolve(__dirname, './shared'),
    ];

    // Hyperion imports some stuff from the API and the frontend
    if (dir === 'hyperion') {
      rule.include.push(path.resolve(__dirname, `./api`));
      rule.include.push(path.resolve(__dirname, `./src`));
    }
  });

  return config;
};

module.exports = {
  webpack: (config, options, webpack) => {
    config.entry.main = [`./${dir}/index.js`];

    config.output.path = path.join(process.cwd(), `build-${dir}`);
    const nodePath = (process.env.NODE_PATH || '')
      .split(path.delimiter)
      .filter(folder => folder && !path.isAbsolute(folder))
      .map(folder => path.resolve('./', folder))
      .join(path.delimiter);

    if (process.env.NODE_ENV !== 'production' && !process.env.SSR) {
      config.plugins.push(
        new webpack.WatchIgnorePlugin([
          path.resolve(__dirname, './src'),
          path.resolve(__dirname, './build'),
        ])
      );
    }
    // Tell Sentry which server the errors are coming from
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.SENTRY_NAME': JSON.stringify(dir),
      })
    );
    if (!config.resolve.modules) config.resolve.modules = [];
    config.resolve.modules.push(nodePath);
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      shared: path.join(nodePath, './shared'),
    };
    config.resolve.modules.push(path.join(nodePath, `./${dir}`));
    config.resolve.modules.push(path.join(nodePath, `./${dir}/node_modules`));
    if (dir === 'hyperion') {
      config.resolve.modules.push(path.join(nodePath, `./node_modules`));
    }

    return transpileShared(config);
  },
};
