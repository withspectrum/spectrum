// @flow
import React from 'react';
import styled from 'styled-components/native';
import { human } from 'react-native-typography';
import type { ComponentType } from 'react';

type TextTypes =
  | 'largeTitle'
  | 'title1'
  | 'title2'
  | 'title3'
  | 'headline'
  | 'body'
  | 'callout'
  | 'subhead'
  | 'footnote'
  | 'caption1'
  | 'caption2';

type Props = {
  type?: TextTypes,
  bold?: boolean,
  italic?: boolean,
  underline?: boolean,
};

const Text: ComponentType<Props> = styled.Text`
  ${(props: Props) => props.bold && 'font-weight: bold;'}
  ${(props: Props) => props.italic && 'font-style: italic;'}
  ${(props: Props) => props.underline && 'text-decoration-line: underline;'}
  ${(props: Props) =>
    props.type &&
    `margin-top: ${human[`${props.type}Object`].lineHeight * 0.35};`}
`;

// NOTE(@mxstbr): For some reason we have to set the style prop here instead of via .attrs
// no clue why :shrugging:
export default (props: Props) => (
  <Text
    {...props}
    style={props.type ? human[`${props.type}Object`] || {} : {}}
  />
);
