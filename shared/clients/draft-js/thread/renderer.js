// @flow
import React from 'react';
import { Line, Paragraph, BlockQuote } from 'src/components/message/style';
import type { Node } from 'react';
import type { KeyObj, KeysObj, DataObj } from '../message/types';

const threadRenderer = {
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
    'header-one': (children: Array<Node>) =>
      children.map(child => <h1>{child}</h1>),
    'header-two': (children: Array<Node>) =>
      children.map(child => <h2>{child}</h2>),
    'unordered-list-item': (children: Array<Node>, { depth, keys }) => (
      <ul key={keys.join('|')}>
        {children.map((child, index) => (
          <li key={keys[index]}>{child}</li>
        ))}
      </ul>
    ),
    'ordered-list-item': (children: Array<Node>, { depth, keys }) => (
      <ol key={keys.join('|')}>
        {children.map((child, index) => (
          <li key={keys[index]}>{child}</li>
        ))}
      </ol>
    ),
  },
  entities: {
    LINK: (children: Array<Node>, data: DataObj, { key }: KeyObj) => (
      <a key={key} href={data.url} target="_blank">
        {children}
      </a>
    ),
  },
  // decorators: [mentionsDecorator, linksDecorator],
};

export default threadRenderer;
