// @flow
import React from 'react';
import findWithRegex from 'find-with-regex';
import type { ContentBlock } from 'draft-js/lib/ContentBlock';
import { URL } from 'shared/regexps';
import { addProtocolToString } from '../../helpers/utils';

let i = 0;
const linksDecorator = {
  strategy: (
    contentBlock: ContentBlock,
    callback: (...args?: Array<any>) => any
  ) => findWithRegex(URL, contentBlock, callback),
  component: (props: Object) => (
    <a
      href={addProtocolToString(props.decoratedText)}
      target="_blank"
      rel="noopener nofollower"
      /* NOTE(@mxstbr): This is super hacky, but I couldn't find a way to give two URLs in the same message a different key. (i.e. "I am on https://github.com, https://github.com is great" would only show the link once) */
      key={`link-${i++}`}
    >
      {props.children}
    </a>
  ),
};

export default linksDecorator;
