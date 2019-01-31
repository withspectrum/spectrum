// @flow
import React from 'react';
import { StyledMarkdownHint, Preformatted } from './style';

type Props = {
  dataCy?: string,
  showHint: boolean,
  style?: Object,
};

export const MarkdownHint = ({ showHint = true, dataCy = '', style = {} }) => {
  return (
    <StyledMarkdownHint showHint={showHint} data-cy={dataCy} style={style}>
      <b>**bold**</b>
      <i>*italic*</i>
      <Preformatted>`code`</Preformatted>
      <Preformatted>```codeblock```</Preformatted>
      <Preformatted>[name](link)</Preformatted>
    </StyledMarkdownHint>
  );
};
