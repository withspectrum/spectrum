// @flow
import React, { Component } from 'react';
import Avatar from '../Avatar';
import { ListItem } from './ListItem';
import { TextColumnContainer, Title, Subtitle, AvatarWrapper } from './style';

type UserListItemType = {
  user: Object,
  onPress: Function,
};

export class UserListItem extends Component<UserListItemType> {
  render() {
    const { user, onPress } = this.props;
    return (
      <ListItem onPress={onPress}>
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
