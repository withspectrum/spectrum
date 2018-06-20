// @flow
import type { Node } from 'react';
import { Platform } from 'react-native';
import styled from 'styled-components/native';
import type { ComponentType } from 'react';
import getTypeConfigFromType from './getTypeConfigFromType';
import getWeightFromType from './getWeightFromType';

export type TextTypes =
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

export type WeightTypes =
  | 'thin'
  | 'ultraLight'
  | 'light'
  | 'regular'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'heavy'
  | 'black';

export type Props = {
  type?: TextTypes,
  weight?: WeightTypes,
  italic?: boolean,
  underline?: boolean,
  fontFamily?: 'monospace',
  color?: Function,
  children: Node,
};

const monospaceFont = Platform.OS === 'android' ? 'monospace' : 'Menlo';

const Text: ComponentType<Props> = styled.Text`
  font-weight: ${props =>
    props.weight ? `${getWeightFromType(props.weight)}` : '400'};
  font-size: ${props => getTypeConfigFromType(props.type).size}px;
  line-height: ${props => getTypeConfigFromType(props.type).leading}px;
  color: ${props =>
    props.color ? props.color(props.theme) : props.theme.text.default};

  ${(props: Props) => props.italic && 'font-style: italic;'} ${(props: Props) =>
    props.underline &&
    'text-decoration-line: underline;'}

  font-family: 'System';
  ${(props: Props) =>
    props.fontFamily === 'monospace' && `font-family: ${monospaceFont};`};
`;

export default Text;
