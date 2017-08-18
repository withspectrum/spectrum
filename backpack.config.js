const path = require('path');

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

    config.resolve.modules.push(nodePath);
    return config;
  },
};
