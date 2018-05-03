// @flow
import React from 'react';
import mentionsDecorator from '../mentions-decorator/index.native';
// import linksDecorator from '../links-decorator/index.native';
import Text from '../../../../mobile/components/Text';
import Codeblock from '../../../../mobile/components/Codeblock';
import type { Node } from 'react';
import type { KeyObj, KeysObj } from './types';

const messageRenderer = {
  inline: {
    BOLD: (children: Array<Node>, { key }: KeyObj) => (
      <Text bold key={`bold-${key}`}>
        {children}
      </Text>
    ),
    ITALIC: (children: Array<Node>, { key }: KeyObj) => (
      <Text italic key={`italic-${key}`}>
        {children}
      </Text>
    ),
    CODE: (children: string, { key }: KeyObj) => (
      <Codeblock key={`codeblock-${key}`}>{children}</Codeblock>
    ),
  },
  blocks: {
    unstyled: (children: Array<Node>, { keys }: KeysObj) =>
      children.map((child, index) => (
        <Text type="body" key={keys[index] || index}>
          {child}
        </Text>
      )),
    'code-block': (children: string, { keys }: KeysObj) => (
      <Codeblock key={keys.join('|')}>{children}</Codeblock>
    ),
  },
  decorators: [mentionsDecorator],
};

export { messageRenderer };
