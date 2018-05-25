// @flow
import * as React from 'react';
import Avatar from '../Avatar';
import { ListItem } from './ListItem';
import { TextColumnContainer, Title, Subtitle, AvatarWrapper } from './style';
import type { Navigation } from '../../utils/types';

type UserListItemType = { user: Object, navigation: Navigation };

export class UserListItem extends React.Component<UserListItemType> {
  render() {
    const { user, navigation } = this.props;
    return (
      <ListItem onPress={() => navigation.navigate(`User`, { id: user.id })}>
        <AvatarWrapper>
          <Avatar src={user.profilePhoto} size={40} />
        </AvatarWrapper>
        <TextColumnContainer>
          <Title numberOfLines={1}>{user.name}</Title>
          <Subtitle numberOfLines={1}>@{user.username}</Subtitle>
        </TextColumnContainer>
      </ListItem>
    );
  }
}
