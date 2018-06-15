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
import type { GetCommunityType } from '../../../shared/graphql/queries/community/getCommunity';

type Props = {
  community: GetCommunityType,
  onPressHandler: Function,
  divider?: boolean,
};

export class CommunityListItem extends Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    const currProps = this.props;
    if (nextProps.community.id !== currProps.community.id) return true;
    return false;
  }

  render() {
    const { community, onPressHandler, divider } = this.props;
    return (
      <ListItem onPressHandler={onPressHandler} divider={divider}>
        <AvatarWrapper>
          <Avatar src={community.profilePhoto} size={40} variant="square" />
        </AvatarWrapper>

        <TextColumnContainer>
          <Title numberOfLines={1}>{community.name}</Title>
          {community.metaData && (
            <Subtitle numberOfLines={1}>
              {community.metaData.members} members
            </Subtitle>
          )}
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
