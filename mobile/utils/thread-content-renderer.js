// @flow
import React from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import redraft from 'redraft';
import Anchor from '../components/Anchor';
import Text from '../components/Text';
import Codeblock from '../components/Codeblock';

const renderer = {
  inline: {
    BOLD: (children, { key }) => (
      <Text bold key={key}>
        {children}
      </Text>
    ),
    ITALIC: (children, { key }) => (
      <Text italic key={key}>
        {children}
      </Text>
    ),
    UNDERLINE: (children, { key }) => (
      <Text underline key={key}>
        {children}
      </Text>
    ),
    CODE: (children, { key }) => <Codeblock key={key}>{children}</Codeblock>,
  },
  entities: {
    // key is the entity key value from raw
    LINK: (children, data, { key }) => (
      <Anchor key={key} href={data.url}>
        {children}
      </Anchor>
    ),
  },
  blocks: {
    unstyled: (children, { keys }) =>
      children.map((child, index) => (
        <Text type="body" key={keys[index] || index}>
          {child}
        </Text>
      )),
    // Note: Headings are offset by one because we always assume the title
    // of the thread to be level 1, so a level 1 heading inside the thread
    // body has to be level 2
    'header-one': (children, { keys }) =>
      children.map((child, index) => (
        <Text type="title2" key={keys[index] || index}>
          {child}
        </Text>
      )),
    'header-two': (children, { keys }) =>
      children.map((child, index) => (
        <Text type="title3" key={keys[index] || index}>
          {child}
        </Text>
      )),
    // blockquote: (children, { keys }) =>
    // 'code-block': (children, { keys }) =>
    'unordered-list-item': (children, { depth, keys }) => {
      return (
        <FlatList
          data={children}
          key={keys[keys.length - 1]}
          renderItem={({ item, index }) => (
            <Text type="body" key={keys[index] || index}>
              {'\u2022'} {item}
            </Text>
          )}
        />
      );
    },
    'ordered-list-item': (children, { depth, keys }) => {
      return (
        <FlatList
          data={children}
          key={keys.join('|')}
          renderItem={({ item, index }) => (
            <Text type="body" key={keys[index] || index}>
              {index}. {item}
            </Text>
          )}
        />
      );
    },
    'code-block': (children, { keys }) => (
      <Codeblock key={keys.join('|')}>{children}</Codeblock>
    ),
  },
};

export default (rawContentState: Object) => redraft(rawContentState, renderer);
