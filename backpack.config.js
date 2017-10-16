const path = require('path');
const ManifestPlugin = require('webpack-module-manifest-plugin');

const dir = process.env.DIR;

if (!dir) throw new Error('Define directory to build with the -d option.');
console.log(
  `> Building ${dir}, entry: ${dir}/index.js, output: build-${dir}/main.js`
);

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
    config.plugins.push(
      new ManifestPlugin({
        filename: './build/server.manifest.json',
      })
    );
    config.resolve.modules.push(nodePath);
    return config;
  },
};
