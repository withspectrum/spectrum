// @flow
import fs from 'fs';
import path from 'path';
import serialize from 'serialize-javascript';

const html = fs
  .readFileSync(path.resolve(__dirname, '..', '..', 'build', 'index.html'))
  .toString()
  .replace(/<script.+?bootstrap\.js\".+?<\/script>/, '');

type Arguments = {
  styleTags: string,
  metaTags: string,
  state: Object,
  content: string,
  scriptTags: string,
};

const sentry = `<script src="https://cdn.ravenjs.com/3.14.0/raven.min.js" crossorigin="anonymous"></script><script>Raven.config('https://3bd8523edd5d43d7998f9b85562d6924@sentry.io/154812', { whitelistUrls: [/spectrum.chat/, /www.spectrum.chat/] }).install();</script>`;

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
        )}</script><div id="root">${content}</div>${scriptTags}`
      )
      // Inject the meta tags at the start of the <head>
      .replace('<head>', `<head>${metaTags}`)
      // Inject the style tags at the end of the <head>
      .replace('</head>', `${styleTags}${sentry}</head>`)
  );
};
