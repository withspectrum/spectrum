// @flow
import React, { Component } from 'react';
import Avatar from '../Avatar';
import { ListItem } from './ListItem';
import { TextColumnContainer, Title, Subtitle, AvatarWrapper } from './style';
import type { GetCommunityType } from '../../../shared/graphql/queries/community/getCommunity';

type CommunityListItemType = {
  community: GetCommunityType,
  onPress: Function,
};

export class CommunityListItem extends Component<CommunityListItemType> {
  render() {
    const { community, onPress } = this.props;
    return (
      <ListItem onPress={onPress}>
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
