// @flow
import styled from 'styled-components/native';
import { TextInput, StyleSheet } from 'react-native';
import { Constants } from 'expo';

export const Header = styled.View`
  background: ${props => props.theme.bg.default};
  padding-top: ${Constants.statusBarHeight + 24};
  padding-bottom: 16px;
  padding-left: 16px;
  padding-right: 16px;
  border-bottom-color: ${props => props.theme.bg.border};
  border-bottom-width: ${StyleSheet.hairlineWidth};
  display: flex;
  width: 100%;
`;

export const SearchBar = styled(TextInput)`
  display: flex;
  height: 40px;
  border-radius: 8px;
  background: ${props => props.theme.bg.wash};
  z-index: 100;
  padding: 4px 0px 4px 12px;
  font-size: 16px;
  font-weight: 600;
  margin-top: 8px;
  border-width: ${StyleSheet.hairlineWidth};
  border-color: ${props => props.theme.bg.border};
`;
