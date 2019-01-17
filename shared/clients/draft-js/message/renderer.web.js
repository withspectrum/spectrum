// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import mentionsDecorator from '../mentions-decorator/index.web';
import linksDecorator from '../links-decorator/index.web';
import { Line, Paragraph, BlockQuote } from 'src/components/message/style';
import type { Node } from 'react';
import type { KeyObj, KeysObj } from './types';

const messageRenderer = {
  inline: {
    BOLD: (children: Array<Node>, { key }: KeyObj) => (
      <span style={{ fontWeight: 700 }} key={key}>
        {children}
      </span>
    ),
    ITALIC: (children: Array<Node>, { key }: KeyObj) => (
      <em key={key}>{children}</em>
    ),
    CODE: (children: Array<Node>, { key }: KeyObj) => (
      <code key={key}>{children}</code>
    ),
  },
  blocks: {
    unstyled: (children: Array<Node>, { keys }: KeysObj) =>
      children.map((child, index) => (
        <Paragraph key={keys[index] || index}>{child}</Paragraph>
      )),
    'code-block': (children: Array<Node>, { keys }: KeysObj) => (
      <Line key={keys.join('|')}>
        {children.map((child, i) => [child, <br key={i} />])}
      </Line>
    ),
    blockquote: (children: Array<Node>, { keys }: KeysObj) =>
      children.map((child, index) => (
        <BlockQuote key={keys[index] || index}>{child}</BlockQuote>
      )),
  },
  entities: {
    LINK: (children, data, { key }) => (
      <a key={key} href={data.url}>
        {children}
      </a>
    ),
  },
  decorators: [mentionsDecorator, linksDecorator],
};

export { messageRenderer };
