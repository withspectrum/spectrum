// @flow
import React from 'react';
import Highlight, { defaultProps } from 'prism-react-renderer';
import { getStringElements } from '../utils/getStringElements';
import mentionsDecorator from '../mentions-decorator/index';
import linksDecorator from '../links-decorator/index';
import { Line, Paragraph, BlockQuote } from 'src/components/message/style';
import type { Node } from 'react';
import type { KeyObj, KeysObj, DataObj } from './types';

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
    'code-block': (children: Array<any>, { keys, data }: KeysObj) => {
      return children.map((child, index) => (
        <Highlight
          {...defaultProps}
          code={getStringElements(child).join('\n')}
          language={Array.isArray(data) && data[0].language}
          theme={undefined}
          key={keys[index]}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <Line className={className} style={style}>
              {tokens.map((line, i) => (
                <div {...getLineProps({ line, key: i })}>
                  {line.map((token, key) => (
                    <span {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </Line>
          )}
        </Highlight>
      ));
    },
    blockquote: (children: Array<Node>, { keys }: KeysObj) =>
      children.map((child, index) => (
        <BlockQuote key={keys[index] || index}>{child}</BlockQuote>
      )),
  },
  entities: {
    LINK: (children: Array<Node>, data: DataObj, { key }: KeyObj) => (
      <a key={key} href={data.url}>
        {children}
      </a>
    ),
  },
  decorators: [mentionsDecorator, linksDecorator],
};

export { messageRenderer };
