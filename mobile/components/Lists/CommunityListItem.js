// @flow
import React, { Component } from 'react';
import Avatar from '../Avatar';
import { ListItem } from './ListItem';
import { TextColumnContainer, Title, Subtitle, AvatarWrapper } from './style';
import type { GetCommunityType } from '../../../shared/graphql/queries/community/getCommunity';

type CommunityListItemType = {
  community: GetCommunityType,
  onPressHandler: Function,
};

export class CommunityListItem extends Component<CommunityListItemType> {
  render() {
    const { community, onPressHandler } = this.props;
    return (
      <ListItem onPressHandler={onPressHandler}>
        <AvatarWrapper>
          <Avatar src={community.profilePhoto} size={40} variant="square" />
        </AvatarWrapper>

        <TextColumnContainer>
          <Title numberOfLines={1}>{community.name}</Title>
          <Subtitle numberOfLines={1}>
            {community.metaData.members} members
          </Subtitle>
        </TextColumnContainer>
      </ListItem>
    );
  }
}
