// @flow
import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import AvatarImage from 'src/components/avatar/image';
import { Link } from 'react-router-dom';
import { Button, OutlineButton } from 'src/components/button';
import JoinCommunityWrapper from 'src/components/joinCommunityWrapper';
import type { GetCommunityType } from 'shared/graphql/queries/community/getCommunity';
import renderTextWithLinks from 'src/helpers/render-text-with-markdown-links';
import type { Dispatch } from 'redux';
import { withCurrentUser } from 'src/components/withCurrentUser';
import {
  HoverWrapper,
  ProfileCard,
  CoverContainer,
  CoverPhoto,
  ProfilePhotoContainer,
  Content,
  Title,
  Description,
  Actions,
} from './style';

type ProfileProps = {
  community: GetCommunityType,
  dispatch: Dispatch<Object>,
  currentUser: ?Object,
  ref: (?HTMLElement) => void,
  style: CSSStyleDeclaration,
};

class HoverProfile extends Component<ProfileProps> {
  render() {
    const { community, ref, style } = this.props;

    const { communityPermissions } = community;
    const { isOwner, isModerator } = communityPermissions;

    return (
      <HoverWrapper popperStyle={style} ref={ref}>
        <ProfileCard>
          <Link to={`/${community.slug}`}>
            <CoverContainer>
              <CoverPhoto src={community.coverPhoto} />
              <ProfilePhotoContainer>
                <AvatarImage
                  src={community.profilePhoto}
                  type={'community'}
                  size={40}
                  isClickable={false}
                  alt={community.name}
                />
              </ProfilePhotoContainer>
            </CoverContainer>
          </Link>

          <Content>
            <Link to={`/${community.slug}`}>
              <Title>{community.name}</Title>
            </Link>
            {community.description && (
              <Description>
                {renderTextWithLinks(community.description)}
              </Description>
            )}
          </Content>

          <Actions>
            {!isModerator && !isOwner && (
              // TODO @Brian
              <JoinCommunityWrapper
                community={community}
                render={({ isLoading }) => {
                  return (
                    <Button loading={isLoading}>
                      {isLoading ? 'Joining...' : 'Join'}
                    </Button>
                  );
                }}
              />
            )}

            {(isModerator || isOwner) && (
              <Link to={`/${community.slug}/settings`}>
                <OutlineButton icon={'settings'}>Settings</OutlineButton>
              </Link>
            )}
          </Actions>
        </ProfileCard>
      </HoverWrapper>
    );
  }
}

export default compose(
  withCurrentUser,
  withRouter,
  connect()
)(HoverProfile);
