// @flow
import fs from 'fs';
import path from 'path';
import serialize from 'serialize-javascript';

const getIndex = () => {
  return (
    fs
      .readFileSync(path.resolve(__dirname, '..', '..', 'build', 'index.html'))
      .toString()
      .replace(
        '<script type="text/javascript" src="/./static/js/bootstrap.js"></script>',
        ''
      )
      // This automatically gets injected without the defer tag in development by create-react-app, gotta get rid of it for dev to work!
      .replace(/(src="\/static\/js\/bundle\.js")/g, ' defer="defer" $1')
  );
};

let html = getIndex();

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
  if (process.env.NODE_ENV === 'development') html = getIndex();
  return (
    html
      // Inject the state and the content instead of <div id="root">
      .replace(
        '<div id="root"></div>',
        `<script>window.__SERVER_STATE__=${serialize(
          state
        )}</script><div id="root">${content}</div><script type="text/javascript" src="/./static/js/bootstrap.js"></script>${sentry}${polyfill}${scriptTags}`
      )
      // Inject the meta tags at the start of the <head>
      .replace('<head>', `<head>${metaTags}`)
      // Inject the style tags at the end of the <head>
      .replace('</head>', `${styleTags}</head>`)
  );
};
