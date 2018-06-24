// @flow
import type { Node } from 'react';
import { Platform } from 'react-primitives';
import styled from 'styled-components/primitives';
import type { ComponentType } from 'react';
import getTypeConfigFromType from './getTypeConfigFromType';
import getWeightFromType from './getWeightFromType';
import type { ThemeType } from '../theme';

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

export type Props = {|
  type?: TextTypes,
  weight?: WeightTypes,
  italic?: boolean,
  underline?: boolean,
  fontFamily?: 'monospace',
  color?: (theme: ThemeType) => string,
  children: Node,
  style?: Object,
|};

const monospaceFont = Platform.OS === 'android' ? 'monospace' : 'Menlo';

const Text: ComponentType<Props> = styled.Text`
  font-weight: ${props =>
    props.weight ? `${getWeightFromType(props.weight)}` : '400'};
  font-size: ${props => getTypeConfigFromType(props.type).size};
  line-height: ${props => getTypeConfigFromType(props.type).leading};
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
