// @flow
import styled from 'styled-components/native';
import { StyleSheet } from 'react-native';

export const Container = styled.View`
  background: ${props => props.theme.bg.default};
  border-bottom-color: ${props => props.theme.bg.hairline};
  border-bottom-width: ${StyleSheet.hairlineWidth};
  border-top-color: ${props => props.theme.bg.hairline};
  border-top-width: ${StyleSheet.hairlineWidth};
`;
