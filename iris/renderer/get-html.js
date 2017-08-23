// @flow
import fs from 'fs';
import path from 'path';

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
  // TODO: Proper sanitization
  // NOTE(@mxstbr): There's some library by Yahoo (I think)
  // specifically for this purpose
  const sanitizedState = JSON.stringify(state).replace(/</g, '\\u003c');
  return (
    html
      // Inject the state and the content instead of <div id="root">
      .replace(
        '<div id="root"></div>',
        `<script>window.__SERVER_STATE__=${sanitizedState}</script><div id="root">${content}</div>`
      )
      // Inject the meta and style tags at the end of the <head>
      .replace('</head>', `${metaTags}${styleTags}</head>`)
  );
};
