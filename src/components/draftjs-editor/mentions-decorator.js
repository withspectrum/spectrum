// @flow
import React from 'react';
import findWithRegex from 'find-with-regex';
import type { ContentBlock } from 'draft-js/lib/ContentBlock';
import { Mention } from './style';
import { MENTIONS } from 'shared/regexps';

const mentionDecorator = {
  strategy: (
    contentBlock: ContentBlock,
    callback: (...args?: Array<any>) => any
  ) => findWithRegex(MENTIONS, contentBlock, callback),
  component: Mention,
};

export default mentionDecorator;
