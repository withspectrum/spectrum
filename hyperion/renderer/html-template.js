// @flow
import fs from 'fs';
import path from 'path';
import { html } from 'common-tags';
import serialize from 'serialize-javascript';

// Match main.asdf123.js in production mode or bundle.js in dev mode
const mainBundleRegex = /(main|bundle)\.(?:.*\.)?js$/;
const bootstrapBundleRegex = /(bootstrap)\.(?:.*\.)?js$/;

let bundles;
try {
  bundles = fs.readdirSync(
    process.env.NODE_ENV === 'production'
      ? './build/static/js'
      : path.join(__dirname, '../../build/static/js')
  );
} catch (err) {
  console.error(err);
  throw new Error(
    'It looks like you didn\'t run "yarn run dev:web" or "yarn run build:web" before starting hyperion. Please wait until either of them completes before starting hyperion.'
  );
}

// Get the main bundle filename
const mainBundle = bundles.find(bundle => mainBundleRegex.test(bundle));
const bootstrapBundle = bundles.find(bundle =>
  bootstrapBundleRegex.test(bundle)
);
if (!mainBundle || !bootstrapBundle) {
  throw new Error(
    'It looks like you didn\'t run "yarn run dev:web" or "yarn run build:web" before starting hyperion. Please wait until either of them completes before starting hyperion.'
  );
}

export const createScriptTag = ({ src }: { src: string }) =>
  `<script defer="defer" src="${src}"></script>`;

export const getHeader = ({
  metaTags,
  nonce,
}: {
  metaTags: string,
  nonce: string,
}) => {
  // prettier-ignore
  return html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <link rel="mask-icon" href="/img/pinned-tab.svg" color="#171A21">
        <meta name="theme-color" content="#171A21">
        <link rel="manifest" href="/manifest.json">
        <meta property="og:site_name" content="Spectrum">
        <meta name="twitter:card" content="summary">
        <meta name="twitter:site" content="@withspectrum">
        <meta name="twitter:image:alt" content="Where communities are built">
        <link rel="apple-touch-icon-precomposed" sizes="57x57" href="/img/apple-icon-57x57-precomposed.png" />
        <link rel="apple-touch-icon-precomposed" sizes="72x72" href="/img/apple-icon-72x72-precomposed.png" />
        <link rel="apple-touch-icon-precomposed" sizes="114x114" href="/img/apple-icon-114x114-precomposed.png" />
        <link rel="apple-touch-icon-precomposed" sizes="144x144" href="/img/apple-icon-144x144-precomposed.png" />
        ${metaTags}
      </head>
      <body>
        <div id="root">`;
};

export const getFooter = ({
  state,
  data,
  bundles,
  nonce,
}: {
  state: Object,
  data: Object,
  bundles: Array<string>,
  nonce: string,
}) => {
  return html`</div>
      <script defer="defer" src="https://cdn.ravenjs.com/3.14.0/raven.min.js" crossorigin="anonymous"></script>
      <script defer="defer" src="/install-raven.js"></script>
      <script nonce="${nonce}">window.__SERVER_STATE__=${serialize(
    state
  )}</script>
      <script nonce="${nonce}">window.__DATA__=${serialize(data)}</script>
      <script defer="defer" type="text/javascript" src="https://cdn.polyfill.io/v2/polyfill.min.js?features=default,Array.prototype.find,Symbol.iterator"></script>
      ${createScriptTag({ src: `/static/js/${bootstrapBundle}` })}
      ${bundles.map(src => createScriptTag({ src }))}
      ${createScriptTag({ src: `/static/js/${mainBundle}` })}
    </body>
    </html>
  `;
};
