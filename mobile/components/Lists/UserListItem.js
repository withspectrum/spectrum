// @flow
import * as React from 'react';
import Avatar from '../Avatar';
import { ListItemWithAvatar } from './ListItemWithAvatar';
import { TextColumnContainer, Title, Subtitle } from './style';
import type { Navigation } from '../../utils/types';

type UserListItemType = { user: Object, navigation: Navigation };

export class UserListItem extends React.Component<UserListItemType> {
  render() {
    const { user, navigation } = this.props;
    return (
      <ListItemWithAvatar
        onPress={() => navigation.navigate(`User`, { id: user.id })}
        AvatarComponent={() => <Avatar src={user.profilePhoto} size={40} />}
      >
        <TextColumnContainer>
          <Title numberOfLines={1}>{user.name}</Title>
          <Subtitle numberOfLines={1}>@{user.username}</Subtitle>
        </TextColumnContainer>
      </ListItemWithAvatar>
    );
  }
}
