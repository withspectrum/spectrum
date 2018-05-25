// @flow
import * as React from 'react';
import Avatar from '../Avatar';
import { ListItem } from './ListItem';
import { TextColumnContainer, Title, Subtitle, AvatarWrapper } from './style';
import type { GetCommunityType } from '../../../shared/graphql/queries/community/getCommunity';
import type { Navigation } from '../../utils/types';

type CommunityListItemType = {
  community: GetCommunityType,
  navigation: Navigation,
};

export class CommunityListItem extends React.Component<CommunityListItemType> {
  render() {
    const { community, navigation } = this.props;
    return (
      <ListItem
        onPress={() => navigation.navigate(`Community`, { id: community.id })}
      >
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
