// @flow
import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import AvatarImage from 'src/components/avatar/image';
import Link from 'src/components/link';
import { Button } from 'src/components/buttons';
import ConditionalWrap from 'src/components/conditionalWrap';
import type { GetUserType } from 'shared/graphql/queries/user/getUser';
import type { Dispatch } from 'redux';
import renderTextWithLinks from 'src/helpers/render-text-with-markdown-links';
import { initNewThreadWithUser } from 'src/actions/directMessageThreads';
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
  innerRef: (?HTMLElement) => void,
  style: CSSStyleDeclaration,
};

class HoverProfile extends Component<ProfileProps> {
  initMessage = () => {
    const { dispatch, user } = this.props;
    dispatch(initNewThreadWithUser(user));
  };

  render() {
    const { user, currentUser, innerRef, style } = this.props;
    const me = currentUser && currentUser.id === user.id;

    return (
      <HoverWrapper popperStyle={style} innerRef={innerRef}>
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

            {user.description && (
              <Description>{renderTextWithLinks(user.description)}</Description>
            )}
          </Content>

          <Actions>
            {!me && (
              <Link to={'/messages/new'}>
                <Button icon={'message'} onClick={this.initMessage}>
                  Message
                </Button>
              </Link>
            )}

            {me && (
              <Link to={'/me'}>
                <Button>My profile</Button>
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
