// @flow
import React from 'react';
import {
  MarkdownHintContainer,
  StyledMarkdownHint,
  Preformatted,
} from './style';

type Props = {
  dataCy?: string,
  showHint: boolean,
  style?: Object,
};

export const MarkdownHint = ({
  showHint = true,
  dataCy = '',
  style = {},
}: Props) => {
  return (
    <MarkdownHintContainer>
      <StyledMarkdownHint showHint={showHint} data-cy={dataCy} style={style}>
        <b>**bold**</b>
        <i>*italic*</i>
        <Preformatted>`code`</Preformatted>
        <Preformatted>```codeblock```</Preformatted>
        <Preformatted>[name](link)</Preformatted>
      </StyledMarkdownHint>
    </MarkdownHintContainer>
  );
};
