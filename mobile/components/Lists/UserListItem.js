// @flow
import React, { Component } from 'react';
import Avatar from '../Avatar';
import { ListItem } from './ListItem';
import Icon from '../Icon';
import {
  TextColumnContainer,
  Title,
  Subtitle,
  AvatarWrapper,
  ViewForwardContainer,
} from './style';

type UserListItemType = {
  user: Object,
  onPressHandler: Function,
  divider?: boolean,
};

export class UserListItem extends Component<UserListItemType> {
  render() {
    const { user, onPressHandler, divider } = this.props;
    return (
      <ListItem onPressHandler={onPressHandler} divider={divider}>
        <AvatarWrapper>
          <Avatar src={user.profilePhoto} size={40} />
        </AvatarWrapper>

        <TextColumnContainer>
          <Title numberOfLines={1}>{user.name}</Title>
          <Subtitle numberOfLines={1}>@{user.username}</Subtitle>
        </TextColumnContainer>

        <ViewForwardContainer>
          <Icon
            glyph={'view-forward'}
            size={24}
            color={theme => theme.text.placeholder}
          />
        </ViewForwardContainer>
      </ListItem>
    );
  }
}
