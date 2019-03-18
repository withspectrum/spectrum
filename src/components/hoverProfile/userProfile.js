// @flow
import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import AvatarImage from 'src/components/avatar/image';
import { Link } from 'react-router-dom';
import Badge from 'src/components/badges';
import {
  PrimaryButton,
  OutlineButton,
} from 'src/views/community/components/button';
import ConditionalWrap from 'src/components/conditionalWrap';
import type { GetUserType } from 'shared/graphql/queries/user/getUser';
import type { Dispatch } from 'redux';
import renderTextWithLinks from 'src/helpers/render-text-with-markdown-links';
import { withCurrentUser } from 'src/components/withCurrentUser';
import InitDirectMessageWrapper from 'src/components/initDirectMessageWrapper';
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
  user: GetUserType,
  dispatch: Dispatch<Object>,
  currentUser: ?Object,
  ref: (?HTMLElement) => void,
  style: CSSStyleDeclaration,
};

class HoverProfile extends Component<ProfileProps> {
  render() {
    const { user, currentUser, ref, style } = this.props;
    const me = currentUser && currentUser.id === user.id;

    return (
      <HoverWrapper popperStyle={style} ref={ref}>
        <ProfileCard>
          <ConditionalWrap
            condition={!!user.username}
            wrap={children => (
              <Link to={`/users/${user.username}`}>{children}</Link>
            )}
          >
            <CoverContainer>
              <CoverPhoto src={user.coverPhoto ? user.coverPhoto : null} />
              <ProfilePhotoContainer>
                <AvatarImage src={user.profilePhoto} type={'user'} size={40} />
              </ProfilePhotoContainer>
            </CoverContainer>
          </ConditionalWrap>

          <Content>
            <ConditionalWrap
              condition={!!user.username}
              wrap={children => (
                <Link to={`/users/${user.username}`}>{children}</Link>
              )}
            >
              <Title>{user.name}</Title>
            </ConditionalWrap>

            {user.betaSupporter && (
              <span style={{ display: 'inline-block', marginBottom: '4px' }}>
                <Badge type="beta-supporter" />
              </span>
            )}

            {user.description && (
              <Description>{renderTextWithLinks(user.description)}</Description>
            )}
          </Content>

          <Actions>
            {!me && (
              <InitDirectMessageWrapper
                user={user}
                render={
                  <PrimaryButton icon={'message-simple-new'}>
                    Message
                  </PrimaryButton>
                }
              />
            )}

            {me && <OutlineButton to={'/me'}>My profile</OutlineButton>}
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
