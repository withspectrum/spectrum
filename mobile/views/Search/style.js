// @flow
import styled from 'styled-components/native';
import { Animated, Dimensions, TextInput, StyleSheet } from 'react-native';
import { Constants } from 'expo';

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

export const SearchBar = styled(TextInput)`
  position: absolute;
  top: ${Constants.statusBarHeight + 16};
  width: ${Dimensions.get('window').width - 32};
  height: 40px;
  left: 16px;
  border-radius: 8px;
  background: ${props => props.theme.bg.wash};
  z-index: 100;
  padding: 4px 0px 4px 12px;
  font-size: 16px;
  font-weight: 600;
`;

export const SearchView = styled.View`
  border-top-color: ${props => props.theme.bg.border};
  border-top-width: ${StyleSheet.hairlineWidth};
  display: flex;
  background: ${props => props.theme.bg.default};
  flex: 1;
`;
