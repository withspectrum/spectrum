// @flow
import styled from 'styled-components/native';
import { TextInput, StyleSheet, ScrollView } from 'react-native';

export const SelectedUserPill = styled.View`
  background: ${props => props.theme.brand.wash};
  border-radius: 16px;
  padding: 4px 12px 4px 8px;
  margin-right: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const ComposerWrapper = styled.View`
  flex-direction: column;
  height: 100%;
  background-color: ${props => props.theme.bg.wash};
`;

export const SearchInputArea = styled.View`
  justify-content: flex-start;
  background-color: ${props => props.theme.bg.default};
  border-bottom-color: ${props => props.theme.bg.hairline};
  border-bottom-width: ${StyleSheet.hairlineWidth};
`;

export const SelectedUsers = styled(ScrollView)`
  flex-direction: row;
  ${props => !props.empty && 'padding: 12px;'};
`;

export const UserSearchInput = styled(TextInput)`
  padding: 12px;
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.text.default};
`;

export const SelectedUserText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.brand.default};
`;

export const SelectedUserRemove = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.brand.default}
  margin-left: 8px;
`;
