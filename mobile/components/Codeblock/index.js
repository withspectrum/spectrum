// @flow
import React from 'react';
import { CodeBlockView, InlineCodeView, CodeText } from './style';

type Props = {
  children: string,
};

export const InlineCodeBlock = (props: Props) => {
  return (
    <InlineCodeView>
      <CodeText fontFamily="monospace">{props.children}</CodeText>
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
