// @flow
import React, { Component } from 'react';
import Avatar from '../Avatar';
import { ListItem } from './ListItem';
import { TextColumnContainer, Title, Subtitle, AvatarWrapper } from './style';
import type { GetCommunityType } from '../../../shared/graphql/queries/community/getCommunity';

type Props = {
  community: GetCommunityType,
  onPressHandler: Function,
};

export class CommunityListItem extends Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    const currProps = this.props;
    if (nextProps.community.id !== currProps.community.id) return true;
    return false;
  }

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
