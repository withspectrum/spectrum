// @flow
import fs from 'fs';
import path from 'path';
import serialize from 'serialize-javascript';

const html = fs
  .readFileSync(path.resolve(__dirname, '..', '..', 'build', 'index.html'))
  .toString();

type Arguments = {
  styleTags: string,
  metaTags: string,
  state: Object,
  content: string,
};

export const getHTML = ({ styleTags, metaTags, state, content }: Arguments) => {
  return (
    html
      // Inject the state and the content instead of <div id="root">
      .replace(
        '<div id="root"></div>',
        `<script>window.__SERVER_STATE__=${serialize(
          state
        )}</script><div id="root">${content}</div>`
      )
      // Inject the meta tags at the start of the <head>
      .replace('<head>', `<head>${metaTags}`)
      // Inject the style tags at the end of the <head>
      .replace('</head>', `${styleTags}</head>`)
  );
};
