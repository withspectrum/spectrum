// @flow
import React from 'react';
import { View, Text } from 'react-native';
import mentionsDecorator from '../mentions-decorator';
import linksDecorator from '../links-decorator';
import type { Node } from 'react';

const codeRenderer = {
  blocks: {
    'code-block': (
      children: Array<Node>,
      { keys }: { keys: Array<string> }
    ) => (
      <View key={keys[0]}>
        {children.map((child, i) => [child, <br key={i} />])}
      </View>
    ),
  },
};

const messageRenderer = {
  blocks: {
    unstyled: (children: Array<Node>, { keys }: { keys: Array<string> }) =>
      children.map((child, index) => (
        <Text key={keys[index] || index}>{child}</Text>
      )),
  },
  decorators: [mentionsDecorator, linksDecorator],
};

export { messageRenderer, codeRenderer };
