// @flow
import * as React from 'react';
import replace from 'string-replace-to-array';
const MARKDOWN_LINK = /(?:\[(.*?)\]\((.*?)\))/g;

export default (text: string) => {
  return replace(text, MARKDOWN_LINK, (fullLink, text, url) => (
    <a href={url} target="_blank" rel="noopener noreferrer" key={url}>
      {text}
    </a>
  ));
};
