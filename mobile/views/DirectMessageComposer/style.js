// @flow
import styled from 'styled-components/native';
import { TextInput, StyleSheet } from 'react-native';

export const SelectedUserPill = styled.View`
  background: ${props => props.theme.brand.wash};
  border-radius: 4px;
  padding: 4px 10px 4px 12px;
  margin-right: 4px;
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

export const SelectedUsers = styled.View`
  flex-direction: row;
  ${props => !props.empty && 'margin: 8px;'};
`;

export const UserSearchInput = styled(TextInput)`
  padding: 12px;
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.text.default};
`;
