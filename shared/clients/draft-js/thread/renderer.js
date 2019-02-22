// @flow
import React from 'react';
import Highlight, { defaultProps } from 'prism-react-renderer';
import { Line, Paragraph, BlockQuote } from 'src/components/message/style';
import {
  AspectRatio,
  EmbedContainer,
  EmbedComponent,
} from 'src/components/rich-text-editor/style';
import mentionsDecorator from '../mentions-decorator';
import linksDecorator from '../links-decorator';
import type { Node } from 'react';
import type { KeyObj, KeysObj, DataObj } from '../message/types';

type EmbedProps = {
  aspectRatio?: string,
  src: string,
  width?: string | number,
  height?: string | number,
};

const Embed = (props: EmbedProps) => {
  const { aspectRatio, src, width = '100%', height = 200 } = props;

  if (!src) return null;

  // if an aspect ratio is passed in, we need to use the EmbedComponent which does some trickery with padding to force an aspect ratio. Otherwise we should just use a regular iFrame
  if (aspectRatio && aspectRatio !== undefined) {
    return (
      <AspectRatio ratio={aspectRatio}>
        <EmbedComponent
          title={`iframe-${src}`}
          width={width}
          height={height}
          allowFullScreen={true}
          frameBorder="0"
          src={src}
        />
      </AspectRatio>
    );
  } else {
    return (
      <EmbedContainer>
        <iframe
          title={`iframe-${src}`}
          width={width}
          height={height}
          allowFullScreen={true}
          frameBorder="0"
          src={src}
        />
      </EmbedContainer>
    );
  }
};

const hasStringElements = (arr: Array<mixed> | mixed) => {
  if (Array.isArray(arr)) return arr.some(elem => hasStringElements(elem));

  return typeof arr === 'string';
};

const getStringElements = (arr: Array<mixed>): Array<string> => {
  return arr
    .map(elem => {
      if (Array.isArray(elem)) return getStringElements(elem);
      if (typeof elem === 'string') return elem;
      // Handle React elements being passed as array elements
      // $FlowIssue
      if (elem.props && elem.props.children)
        return getStringElements(elem.props.children);
      return null;
    })
    .filter(Boolean)
    .reduce((final, elem) => {
      if (Array.isArray(elem)) return [...final, ...elem];
      return [...final, elem];
    }, []);
};

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
    unstyled: (children: Array<Node>, { keys }: KeysObj) => {
      // If the children are text, render a paragraph
      if (hasStringElements(children)) {
        return children.map((child, index) => (
          <Paragraph key={keys[index]}>{child}</Paragraph>
        ));
      }

      return children;
    },
    'code-block': (children: Array<mixed>, { keys, data }: KeysObj) => {
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
    'header-one': (children: Array<Node>, { keys }: KeysObj) =>
      children.map((child, index) => <h1 key={keys[index]}>{child}</h1>),
    'header-two': (children: Array<Node>) =>
      children.map((child, index) => <h2 key={keys[index]}>{child}</h2>),
    'header-three': (children: Array<Node>) =>
      children.map((child, index) => <h3 key={keys[index]}>{child}</h3>),
    'unordered-list-item': (children: Array<Node>, { keys }: KeysObj) => (
      <ul key={keys.join('|')}>
        {children.map((child, index) => (
          <li key={keys[index]}>{child}</li>
        ))}
      </ul>
    ),
    'ordered-list-item': (children: Array<Node>, { keys }: KeysObj) => (
      <ol key={keys.join('|')}>
        {children.map((child, index) => (
          <li key={keys[index]}>{child}</li>
        ))}
      </ol>
    ),
  },
  entities: {
    LINK: (children: Array<Node>, data: DataObj, { key }: KeyObj) => (
      <a key={key} href={data.url || data.href} target="_blank">
        {children}
      </a>
    ),
    IMAGE: (
      children: Array<Node>,
      data: { src?: string, alt?: string },
      { key }: KeyObj
    ) => <img key={key} src={data.src} alt={data.alt} />,
    embed: (children: Array<Node>, data: Object, { key }: KeyObj) => (
      <Embed key={key} {...data} />
    ),
  },
  decorators: [mentionsDecorator, linksDecorator],
};

export default threadRenderer;
