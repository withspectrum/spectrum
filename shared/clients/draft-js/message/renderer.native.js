// @flow
import React from 'react';
import mentionsDecorator from '../mentions-decorator/index.native';
import linksDecorator from '../links-decorator/index.native';
import { BodyText } from '../../../../mobile/components/ThreadContent/style';
import {
  CodeBlock,
  InlineCodeBlock,
} from '../../../../mobile/components/Codeblock';
import type { Node } from 'react';
import type { KeyObj, KeysObj } from './types';

const messageRenderer = {
  inline: {
    BOLD: (children: Array<Node>, { key }: KeyObj) => (
      <BodyText bold key={`bold-${key}`}>
        {children}
      </BodyText>
    ),
    ITALIC: (children: Array<Node>, { key }: KeyObj) => (
      <BodyText italic key={`italic-${key}`}>
        {children}
      </BodyText>
    ),
    CODE: (children: string, { key }: KeyObj) => (
      <InlineCodeBlock key={`inline-codeblock-${key}`}>
        {children}
      </InlineCodeBlock>
    ),
  },
  blocks: {
    unstyled: (children: Array<Node>, { keys }: KeysObj) =>
      children.map((child, index) => (
        <BodyText key={keys[index] || index}>{child}</BodyText>
      )),
    'code-block': (children: string, { keys }: KeysObj) => (
      <CodeBlock key={keys.join('|')}>{children}</CodeBlock>
    ),
  },
  decorators: [mentionsDecorator, linksDecorator],
};

export { messageRenderer };
