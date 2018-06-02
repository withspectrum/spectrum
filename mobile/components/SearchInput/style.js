// @flow
import styled from 'styled-components/native';
import { Dimensions, TextInput, StyleSheet } from 'react-native';
import { Constants } from 'expo';

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
  border-width: ${StyleSheet.hairlineWidth};
  border-color: ${props => props.theme.bg.border};
`;
