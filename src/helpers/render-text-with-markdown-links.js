// @flow
import * as React from 'react';
import replace from 'string-replace-to-array';
import { Link } from 'react-router-dom';
import { SPECTRUM_URLS } from 'shared/regexps';
const MARKDOWN_LINK = /(?:\[(.*?)\]\((.*?)\))/g;

export default (text: string) => {
  return replace(text, MARKDOWN_LINK, (fullLink, text, url) => {
    const regexp = new RegExp(SPECTRUM_URLS, 'ig');
    const match = regexp.exec(url);

    if (match && match[0] && match[1]) return <Link to={match[1]}>{text}</Link>;

    return (
      <a href={url} target="_blank" rel="noopener noreferrer" key={url}>
        {text}
      </a>
    );
  });
};
