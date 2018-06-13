// @flow
import React from 'react';
import styled from 'styled-components/native';
import Text from '../../components/Text';
import TouchableHighlight from '../../components/TouchableHighlight';
import { getUserById } from '../../../shared/graphql/queries/user/getUser';
import type { ComponentType } from 'react';

const SelectedUserPill = styled.View`
  background: ${props => props.theme.brand.wash};
  border-radius: 4px;
  padding: 4px 12px;
  margin-right: 4px;
`;

export const SelectedUser: ComponentType<{
  id: string,
  onPressHandler: Function,
}> = getUserById(({ data, onPressHandler }) => {
  if (data.user)
    return (
      <TouchableHighlight onPress={onPressHandler}>
        <SelectedUserPill>
          <Text
            type="body"
            style={{ marginTop: 0, fontSize: 14 }}
            color={props => props.theme.brand.default}
          >
            {data.user.name}
          </Text>
        </SelectedUserPill>
      </TouchableHighlight>
    );

  return null;
});

export const ComposerWrapper = styled.View`
  flex-direction: column;
  height: 100%;
  background-color: ${props => props.theme.bg.wash};
`;

export const SearchInputArea = styled.View`
  justify-content: flex-start;
  background-color: ${props => props.theme.bg.default};
  border-bottom-width: 1;
  border-bottom-color: ${props => props.theme.bg.border};
`;

export const SelectedUsers = styled.View`
  flex-direction: row;
  ${props => !props.empty && 'margin: 8px;'};
`;
