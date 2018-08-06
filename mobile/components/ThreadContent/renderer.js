// @flow
import React from 'react';
import { View } from 'react-native';
import redraft from 'redraft';
import { ThreadAnchor } from '../Anchor';
import { CodeBlock, InlineCodeBlock } from '../Codeblock';
import IFrame from '../IFrame';
import { BodyText, HeaderOne, HeaderTwo } from './style';

const renderer = {
  inline: {
    BOLD: (children, { key }) => (
      <BodyText bold key={`bold-${key}`}>
        {children}
      </BodyText>
    ),
    ITALIC: (children, { key }) => (
      <BodyText italic key={`italic-${key}`}>
        {children}
      </BodyText>
    ),
    UNDERLINE: (children, { key }) => (
      <BodyText underline key={`underline-${key}`}>
        {children}
      </BodyText>
    ),
    CODE: (children, { key }) => (
      <InlineCodeBlock key={`inline-code-${key}`}>{children}</InlineCodeBlock>
    ),
  },
  entities: {
    // key is the entity key value from raw
    LINK: (children, data, { key }) => (
      <ThreadAnchor key={`anchor-${key}`} href={data.url}>
        {children}
      </ThreadAnchor>
    ),
    embed: (children, { src }, { key }) => {
      return <IFrame key={`embed-${key}`} src={src} />;
    },
  },
  blocks: {
    fallback: (children, { keys }) => (
      <View key={`fallback-${keys.join('|')}`}>{children}</View>
    ),
    unstyled: (children, { keys }) =>
      children.map((child, index) => (
        <BodyText key={keys[index] || `unstyled-${index}`}>{child}</BodyText>
      )),
    // Note: Headings are offset by one because we always assume the title
    // of the thread to be level 1, so a level 1 heading inside the thread
    // body has to be level 2
    'header-one': (children, { keys }) =>
      children.map((child, index) => (
        <HeaderOne key={keys[index] || `header-one-${index}`}>
          {child}
        </HeaderOne>
      )),
    'header-two': (children, { keys }) =>
      children.map((child, index) => (
        <HeaderTwo key={keys[index] || `header-two-${index}`}>
          {child}
        </HeaderTwo>
      )),
    // blockquote: (children, { keys }) =>
    'unordered-list-item': (children, { depth, keys }) => {
      return children.map((item, index) => (
        <BodyText key={keys[index] || `uli-${index}`}>
          {'\u2022'} {item}
        </BodyText>
      ));
    },
    'ordered-list-item': (children, { depth, keys }) => {
      return children.map((item, index) => (
        <BodyText key={keys[index] || `oli-${index}`}>
          {index}. {item}
        </BodyText>
      ));
    },
    'code-block': (children, { keys }) => (
      <CodeBlock key={`codeblock-${keys.join('|')}`}>{children}</CodeBlock>
    ),
  },
};

export default (rawContentState: Object) =>
  redraft(rawContentState, renderer, {
    blockFallback: 'fallback',
  });
