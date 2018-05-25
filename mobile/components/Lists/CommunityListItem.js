// @flow
import * as React from 'react';
import Avatar from '../Avatar';
import { ListItemWithAvatar } from './ListItemWithAvatar';
import { TextColumnContainer, Title, Subtitle } from './style';
import type { Navigation } from '../../utils/types';

type CommunityListItemType = { community: Object, navigation: Navigation };

export class CommunityListItem extends React.Component<CommunityListItemType> {
  render() {
    const { community, navigation } = this.props;
    return (
      <ListItemWithAvatar
        onPress={() => navigation.navigate(`Community`, { id: community.id })}
        AvatarComponent={() => (
          <Avatar src={community.profilePhoto} size={40} variant="square" />
        )}
      >
        <TextColumnContainer>
          <Title numberOfLines={1}>{community.name}</Title>
          <Subtitle numberOfLines={1}>
            {community.metaData.members} members
          </Subtitle>
        </TextColumnContainer>
      </ListItemWithAvatar>
    );
  }
}
