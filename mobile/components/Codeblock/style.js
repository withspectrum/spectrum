// @flow
import styled from 'styled-components/native';
import { Platform, StyleSheet, Dimensions } from 'react-native';

const monospaceFont = Platform.OS === 'android' ? 'monospace' : 'Menlo';
export const CodeText = styled.Text`
  ${props =>
    props.fontFamily === 'monospace' &&
    `font-family: ${monospaceFont};`} line-height: 20;
`;

const width = Dimensions.get('window').width + 32;
export const CodeBlockView = styled.View`
  width: ${width};
  flex: 1;
  display: flex;
  margin: 16px -16px;
  padding: 16px 40px 16px 16px;
  background: ${props => props.theme.bg.wash};
  border-bottom-color: ${props => props.theme.bg.hairline};
  border-bottom-width: ${StyleSheet.hairlineWidth};
  border-top-color: ${props => props.theme.bg.hairline};
  border-top-width: ${StyleSheet.hairlineWidth};
`;

export const InlineCodeView = styled.View`
  align-items: center;
  height: 20px;
  justify-content: center;
  background: ${props => props.theme.bg.wash};
  border-radius: 4px;
  border-bottom-color: ${props => props.theme.bg.hairline};
  border-bottom-width: ${StyleSheet.hairlineWidth};
  border-top-color: ${props => props.theme.bg.hairline};
  border-top-width: ${StyleSheet.hairlineWidth};
  border-left-color: ${props => props.theme.bg.hairline};
  border-left-width: ${StyleSheet.hairlineWidth};
  border-right-color: ${props => props.theme.bg.hairline};
  border-right-width: ${StyleSheet.hairlineWidth};
`;

export const InlineCodeText = styled(CodeText)`
  padding: 0 4px 1px;
  color: ${props => props.theme.text.secondary};
`;
