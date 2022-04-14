// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import Highlight, { defaultProps } from 'prism-react-renderer';
import { Line, Paragraph, BlockQuote } from 'src/components/message/style';
import {
  AspectRatio,
  EmbedContainer,
  EmbedComponent,
} from 'src/components/rich-text-editor/style';
import ThreadAttachment from 'src/components/message/threadAttachment';
import { getStringElements } from '../utils/getStringElements';
import { hasStringElements } from '../utils/hasStringElements';
import mentionsDecorator from '../mentions-decorator';
import linksDecorator from '../links-decorator';
import type { Node } from 'react';
import { SPECTRUM_URLS } from 'shared/regexps';
import type { KeyObj, KeysObj, DataObj } from '../message/types';
import type {
  EmbedData,
  ExternalEmbedData,
  InternalEmbedData,
} from '../../../draft-utils/add-embeds-to-draft-js';

const ExternalEmbed = (props: { ...ExternalEmbedData, src?: string }) => {
  let { aspectRatio, url, src, width = '100%', height = 200 } = props;

  if (!src && url) src = url;
  if (typeof src !== 'string') return null;

  // if an aspect ratio is passed in, we need to use the EmbedComponent which does some trickery with padding to force an aspect ratio. Otherwise we should just use a regular iFrame
  if (aspectRatio && aspectRatio !== undefined) {
    return (
      <AspectRatio style={{ height }} ratio={aspectRatio}>
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
      <EmbedContainer style={{ height }}>
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

const InternalEmbed = (props: InternalEmbedData) => {
  if (props.entity !== 'thread') return null;

  return <ThreadAttachment id={props.id} />;
};

const Embed = (props: EmbedData) => {
  if (props.type === 'internal') {
    return <InternalEmbed {...props} />;
  }

  return <ExternalEmbed {...props} />;
};

const EMPTY_THEME = {
  plain: {},
  styles: [],
};

type Options = {
  headings: boolean,
};

export const createRenderer = (options: Options) => {
  return {
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
      'code-block': (children: Array<any>, { keys, data }: KeysObj) => {
        return children.map((child, index) => (
          <Highlight
            {...defaultProps}
            code={getStringElements(child).join('\n')}
            language={Array.isArray(data) && data[0].language}
            theme={EMPTY_THEME}
            key={keys[index]}
          >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <Line className={className} style={style}>
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line, key: i })}>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token, key })} />
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
      ...(!options.headings
        ? {}
        : {
            'header-one': (children: Array<Node>, { keys }: KeysObj) =>
              children.map((child, index) => (
                <h1 key={keys[index]}>{child}</h1>
              )),
            'header-two': (children: Array<Node>, { keys }: KeysObj) =>
              children.map((child, index) => (
                <h2 key={keys[index]}>{child}</h2>
              )),
            'header-three': (children: Array<Node>, { keys }: KeysObj) =>
              children.map((child, index) => (
                <h3 key={keys[index]}>{child}</h3>
              )),
          }),
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
      LINK: (children: Array<Node>, data: DataObj, { key }: KeyObj) => {
        const link = data.url || data.href;

        if (link) {
          const regexp = new RegExp(SPECTRUM_URLS, 'ig');
          const match = regexp.exec(link);
          if (match && match[0] && match[1]) {
            return <Link to={match[1]}>{children}</Link>;
          }
        }

        return (
          <a key={key} href={link} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        );
      },
      IMAGE: (
        children: Array<Node>,
        data: { src?: string, alt?: string },
        { key }: KeyObj
      ) => <img key={key} src={data.src} alt={data.alt || 'Image'} />,
      embed: (children: Array<Node>, data: Object, { key }: KeyObj) => (
        <Embed key={key} {...data} />
      ),
    },
    decorators: [mentionsDecorator, linksDecorator],
  };
};
