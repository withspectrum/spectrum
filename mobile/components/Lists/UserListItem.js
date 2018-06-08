// @flow
import React, { Component } from 'react';
import Avatar from '../Avatar';
import { ListItem } from './ListItem';
import { TextColumnContainer, Title, Subtitle, AvatarWrapper } from './style';

type UserListItemType = {
  user: Object,
  onPressHandler: Function,
};

export class UserListItem extends Component<UserListItemType> {
  render() {
    const { user, onPressHandler } = this.props;
    return (
      <ListItem onPressHandler={onPressHandler}>
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
