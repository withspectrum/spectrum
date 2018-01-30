// @flow
import fs from 'fs';
import path from 'path';
import serialize from 'serialize-javascript';

const getIndex = () => {
  return fs
    .readFileSync(path.resolve(__dirname, '..', '..', 'build', 'index.html'))
    .toString()
    .replace(
      '<script type="text/javascript" src="/./static/js/bootstrap.js"></script>',
      ''
    );
};

let html = getIndex();

export const createScriptTag = ({ src }: { src: string }) =>
  `<script defer="defer" src="${src}"></script>`;

const sentry = `<script defer="defer" src="https://cdn.ravenjs.com/3.14.0/raven.min.js" crossorigin="anonymous"></script><script defer="defer" src="/install-raven.js"></script>`;

const polyfill = createScriptTag({
  src: 'https://cdn.polyfill.io/v2/polyfill.min.js',
});

const div = '<div id="root"></div>';
// Split the HTML in two parts, header and footer, where the React code should be inserted
const header = html.substr(0, html.indexOf(div) + 15);
const footer = html.substr(html.indexOf(div) + div.length - 6);

export const getHeader = ({ metaTags }: { metaTags: string }) => {
  // Inject the meta tags right after the charset declaration
  return header.replace(
    '<meta charset="utf-8">',
    `<meta charset="utf-8">${metaTags}`
  );
};

const sentryScript = process.env.NODE_ENV === 'production' ? sentry : '';
export const getFooter = ({
  state,
  data,
  bundleScriptTags,
}: {
  state: Object,
  data: Object,
  bundleScriptTags: string,
}) => {
  const stateScript = `<script>window.__SERVER_STATE__=${serialize(
    state
  )}</script>`;
  const dataScript = `<script>window.__DATA__=${serialize(data)}</script>`;
  return `</div>
    ${sentryScript}
    ${stateScript}
    ${dataScript}
    ${polyfill}
    <script type="text/javascript" src="/./static/js/bootstrap.js"></script>
    ${bundleScriptTags}
    ${footer.replace('</div>', '')}
  `;
};
