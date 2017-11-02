// @flow
import React from 'react';
import findWithRegex from 'find-with-regex';
import type { ContentBlock } from 'draft-js/lib/ContentBlock';
import { URL } from 'shared/regexps';
import { addProtocolToString } from '../../helpers/utils';

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
    >
      {props.children[0]}
    </a>
  ),
};

export default linksDecorator;
