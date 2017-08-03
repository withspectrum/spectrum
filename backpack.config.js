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

    return config;
  },
};
