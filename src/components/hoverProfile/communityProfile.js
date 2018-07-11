// @flow
import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import AvatarImage from 'src/components/avatar/image';
import Link from 'src/components/link';
import { Button, OutlineButton } from 'src/components/buttons';
import ToggleCommunityMembership from 'src/components/toggleCommunityMembership';
import type { GetCommunityType } from 'shared/graphql/queries/community/getCommunity';
import renderTextWithLinks from 'src/helpers/render-text-with-markdown-links';
import type { Dispatch } from 'redux';
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
  innerRef: (?HTMLElement) => void,
  style: CSSStyleDeclaration,
};

class HoverProfile extends Component<ProfileProps> {
  render() {
    const { community, innerRef, style } = this.props;

    const { communityPermissions } = community;
    const { isMember, isOwner, isModerator } = communityPermissions;

    return (
      <HoverWrapper popperStyle={style} innerRef={innerRef}>
        <ProfileCard>
          <Link to={`/${community.slug}`}>
            <CoverContainer>
              <CoverPhoto src={community.coverPhoto} />
              <ProfilePhotoContainer>
                <AvatarImage
                  src={community.profilePhoto}
                  type={'community'}
                  size={40}
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
            {!isModerator &&
              !isOwner && (
                <ToggleCommunityMembership
                  community={community}
                  render={({ isLoading }) => {
                    if (isMember) {
                      return (
                        <OutlineButton
                          loading={isLoading}
                          icon={'checkmark'}
                          gradientTheme="success"
                        >
                          Member
                        </OutlineButton>
                      );
                    } else {
                      return (
                        <Button
                          loading={isLoading}
                          icon={'plus-fill'}
                          gradientTheme="success"
                        >
                          Join
                        </Button>
                      );
                    }
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

const map = state => ({ currentUser: state.users.currentUser });
//$FlowFixMe
export default compose(connect(map), withRouter)(HoverProfile);
