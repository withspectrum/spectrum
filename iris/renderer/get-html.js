// @flow
import fs from 'fs';
import path from 'path';
import serialize from 'serialize-javascript';

const html = fs
  .readFileSync(path.resolve(__dirname, '..', '..', 'build', 'index.html'))
  .toString()
  .replace(
    '<script type="text/javascript" src="/./static/js/bootstrap.js">',
    ''
  )
  .replace(/(src="\/static\/js\/main\.\w+?\.js")/g, ' defer="defer" $1');

type Arguments = {
  styleTags: string,
  metaTags: string,
  state: Object,
  content: string,
  scriptTags: string,
};

export const createScriptTag = ({ src }: { src: string }) =>
  `<script defer="defer" src="${src}"></script>`;

const sentry = `<script defer="defer" src="https://cdn.ravenjs.com/3.14.0/raven.min.js" crossorigin="anonymous"></script><script defer="defer" src="/install-raven.js"></script>`;

const polyfill = createScriptTag({
  src: 'https://cdn.polyfill.io/v2/polyfill.min.js',
});

export const getHTML = ({
  styleTags,
  metaTags,
  state,
  content,
  scriptTags,
}: Arguments) => {
  return (
    html
      // Inject the state and the content instead of <div id="root">
      .replace(
        '<div id="root"></div>',
        `<script>window.__SERVER_STATE__=${serialize(
          state
        )}</script><div id="root">${content}</div>${sentry}${polyfill}${scriptTags}`
      )
      // Inject the meta tags at the start of the <head>
      .replace('<head>', `<head>${metaTags}`)
      // Inject the style tags at the end of the <head>
      .replace('</head>', `${styleTags}</head>`)
  );
};
