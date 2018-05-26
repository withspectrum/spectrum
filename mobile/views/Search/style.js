// @flow
import styled from 'styled-components/native';
import { Animated, StyleSheet } from 'react-native';

export const TabLabel = styled(Animated.Text)`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 72px 8px 8px;
  font-size: 14px;
  font-weight: ${props => (props.active ? '700' : '400')};
  color: ${props =>
    props.active ? props.theme.text.default : props.theme.text.alt};
  position: relative;
  z-index: 100;
`;

export const SearchView = styled.View`
  border-top-color: ${props => props.theme.bg.hairline};
  border-top-width: ${StyleSheet.hairlineWidth};
  display: flex;
  background: ${props => props.theme.bg.default};
  flex: 1;
`;
