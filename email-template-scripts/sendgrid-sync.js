// @flow
require('now-env');
const fs = require('fs');
const util = require('util');
const fetch = require('isomorphic-fetch');
const textversion = require('textversionjs');
const { SENDGRID_API_KEY } = process.env;
const RELATIVE_PATH_TO_TEMPLATES = '../built-email-templates';
const processArgs = process.argv.slice(2);
const UPDATE_PROD_TEMPLATES = processArgs.some(arg => arg === 'prod');

if (!SENDGRID_API_KEY) {
  console.error('❌ Be sure to provide a SendGrid API key');
  return;
}

const readdirAsync = path => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

const processFile = (file, config) => {
  const plainTextConfig = {
    uIndentationChar: ' ',
    oIndentationChar: ' ',
    listIndentationTabs: 2,
    keepNbsps: true,
    linkProcess: (href, text) => `${text} (${href})`,
  };

  const { version, template } = config;

  const hostname = 'https://api.sendgrid.com/v3';
  const path = `/templates/${template}/versions/${version}`;
  const url = hostname + path;

  const html_content = file;
  const plain_content = textversion(html_content, plainTextConfig);

  const data = {
    html_content,
    plain_content,
  };

  const options = {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(data),
  };

  console.error('♻️ Uploading template to SendGrid');

  return fetch(url, options)
    .then(res => res.json())
    .then(res => {
      console.error('✅ Saved template on SendGrid');
    })
    .catch(err => {
      console.error({ err });
    });
};

const processPath = path => {
  const file = fs.readFile(
    `${RELATIVE_PATH_TO_TEMPLATES}/${path}`,
    { encoding: 'utf-8' },
    (err, file) => {
      if (err) {
        console.error({ err });
        return;
      }

      const configStart = file.indexOf('START_CONFIG');
      const configEnd = file.indexOf('END_CONFIG');
      const configString = file
        .slice(configStart, configEnd)
        .replace('START_CONFIG', '')
        .replace(/(\r\n\t|\n|\r\t)/gm, '');

      let config;
      try {
        config = JSON.parse(configString);
      } catch (err) {
        console.error({ err, configString, file, configStart, configEnd });
        return;
      }

      if (!UPDATE_PROD_TEMPLATES && !config.test) {
        console.error('🔅 No test config for this template, skipping');
        return;
      }

      const { test: testConfig, production: prodConfig } = config;

      return Promise.all([
        testConfig && processFile(file, testConfig),
        UPDATE_PROD_TEMPLATES && processFile(file, prodConfig),
      ]);
    }
  );
};

const init = async () => {
  const paths = await readdirAsync(RELATIVE_PATH_TO_TEMPLATES);

  return paths.map(async path => {
    return await processPath(path);
  });
};

init();
