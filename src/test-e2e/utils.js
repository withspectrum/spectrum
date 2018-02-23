// @flow

// If DEBUG_E2E is set show a browser and run test in slow mo
export const config = process.env.DEBUG_E2E
  ? {
      headless: false,
      slowMo: 100,
    }
  : {
      // This is needed, otherwise tests fail in CircleCI
      // Ref: https://github.com/GoogleChrome/puppeteer/issues/1700
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    };
