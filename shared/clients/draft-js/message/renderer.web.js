// @flow
import React from 'react';
import mentionsDecorator from '../mentions-decorator/index.web';
import linksDecorator from '../links-decorator/index.web';
import { Line, Paragraph } from 'src/components/message/style';
import type { Node } from 'react';

const codeRenderer = {
  blocks: {
    'code-block': (
      children: Array<Node>,
      { keys }: { keys: Array<string> }
    ) => (
      <Line key={keys[0]}>
        {children.map((child, i) => [child, <br key={i} />])}
      </Line>
    ),
  },
};

const messageRenderer = {
  blocks: {
    unstyled: (children: Array<Node>, { keys }: { keys: Array<string> }) =>
      children.map((child, index) => (
        <Paragraph key={keys[index] || index}>{child}</Paragraph>
      )),
  },
  decorators: [mentionsDecorator, linksDecorator],
};

export { messageRenderer, codeRenderer };
