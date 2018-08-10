// @flow
import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import AvatarImage from 'src/components/avatar/image';
import Link from 'src/components/link';
import Icon from 'src/components/icon';
import { PrimaryButton, OutlineButton } from 'src/components/button';
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
                  clickable={false}
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
                        <PrimaryButton loading={isLoading}>
                          <Icon glyph="checkmark" />
                          Member
                        </PrimaryButton>
                      );
                    } else {
                      return (
                        <PrimaryButton loading={isLoading}>
                          <Icon glyph="plus-fill" />
                          Join
                        </PrimaryButton>
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
export default compose(
  //$FlowFixMe
  connect(map),
  withRouter
)(HoverProfile);
