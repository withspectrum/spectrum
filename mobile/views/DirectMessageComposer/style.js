// @flow
import React from 'react';
import styled from 'styled-components/native';
import Text from '../../components/Text';
import { getUserById } from '../../../shared/graphql/queries/user/getUser';
import type { ComponentType } from 'react';

export const SelectedUser: ComponentType<{
  id: string,
  onPressHandler: Function,
}> = getUserById(({ data, onPressHandler }) => {
  if (data.user) return <Text type="body">{data.user.name}</Text>;

  return null;
});

export const ComposerWrapper = styled.View`
  flex-direction: column;
  height: 100%;
  background-color: ${props => props.theme.bg.wash};
`;

export const SearchInputArea = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  background-color: ${props => props.theme.bg.default};
  border-bottom-width: 1;
  border-bottom-color: ${props => props.theme.bg.border};
`;

export const SelectedUsers = styled.View`
  flex-direction: row;
`;
