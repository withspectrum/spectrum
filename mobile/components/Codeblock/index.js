// @flow
import React from 'react';
import {
  CodeBlockView,
  InlineCodeView,
  InlineCodeText,
  CodeText,
} from './style';

type Props = {
  children: string,
};

export const InlineCodeBlock = (props: Props) => {
  return (
    <InlineCodeView>
      <InlineCodeText fontFamily="monospace">{props.children}</InlineCodeText>
    </InlineCodeView>
  );
};

export const CodeBlock = (props: Props) => {
  return (
    <CodeBlockView>
      <CodeText fontFamily="monospace">{props.children}</CodeText>
    </CodeBlockView>
  );
};
