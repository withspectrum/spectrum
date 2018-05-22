// @flow
import type { Node } from 'react';
import { Platform } from 'react-native';
import styled, { css } from 'styled-components/native';
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

export type Props = {
  type?: TextTypes,
  bold?: boolean,
  italic?: boolean,
  underline?: boolean,
  fontFamily?: 'monospace',
  color?: string | Function,
  children: Node,
};

const monospaceFont = Platform.OS === 'android' ? 'monospace' : 'Menlo';

const Text: ComponentType<Props> = styled.Text`
  ${(props: Props) => props.type && human[`${props.type}Object`]}
  ${(props: Props) =>
    props.type &&
    `margin-top: ${human[`${props.type}Object`].lineHeight * 0.35};`}
  ${(props: Props) => props.bold && 'font-weight: bold;'}
  ${(props: Props) => props.italic && 'font-style: italic;'}
  ${(props: Props) => props.underline && 'text-decoration-line: underline;'}
  ${(props: Props) =>
    props.color &&
    css`
      color: ${props.color};
    `}
  ${(props: Props) =>
    props.fontFamily === 'monospace' && `font-family: ${monospaceFont};`}
`;

export default Text;
