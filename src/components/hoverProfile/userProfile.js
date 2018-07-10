// @flow
import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import Link from 'src/components/link';
import { withRouter } from 'react-router';
import Reputation from 'src/components/reputation';
import Icon from 'src/components/icons';
import Badge from 'src/components/badges';
import { Button } from 'src/components/buttons';
import addProtocolToString from 'shared/normalize-url';
import { Card } from 'src/components/card';
import { initNewThreadWithUser } from 'src/actions/directMessageThreads';
import AvatarImage from 'src/components/avatar/image';
import type { GetUserType } from 'shared/graphql/queries/user/getUser';
import type { Dispatch } from 'redux';
import {
  CoverLink,
  CoverPhoto,
  CoverTitle,
  CoverSubtitle,
  CoverDescription,
  ExtLink,
  MessageButtonContainer,
} from 'src/components/profile/style';
import { HoverWrapper } from './style';

type ProfileProps = {
  user: {
    ...$Exact<GetUserType>,
    contextPermissions: {
      reputation: number,
    },
  },
  dispatch: Dispatch<Object>,
  currentUser: ?Object,
  innerRef: (?HTMLElement) => void,
  style: CSSStyleDeclaration,
};

class HoverProfile extends Component<ProfileProps> {
  initMessage = (dispatch, user) => {
    dispatch(initNewThreadWithUser(user));
  };

  render() {
    const { user, dispatch, currentUser, innerRef, style } = this.props;

    return (
      <HoverWrapper popperStyle={style} innerRef={innerRef}>
        <Card
          style={{
            boxShadow: '0 4px 8px rgba(18, 22, 23, .25)',
            borderRadius: '16px',
          }}
        >
          <CoverPhoto url={user.coverPhoto} />
          <CoverLink to={`/users/${user.username}`}>
            <AvatarImage
              src={user.profilePhoto}
              size="64"
              style={{ boxShadow: '0 0 0 2px white', zIndex: '2' }}
            />
            <CoverTitle>{user.name}</CoverTitle>
          </CoverLink>
          <CoverSubtitle center>
            @{user.username}
            {user.isPro && <Badge type="pro" />}
            <Reputation
              tipText={'Total rep across all communities'}
              size={'large'}
              reputation={
                user.contextPermissions
                  ? user.contextPermissions.reputation
                  : user.totalReputation
              }
            />
          </CoverSubtitle>

          {(user.description || user.website) && (
            <CoverDescription>
              {user.description && <p>{user.description}</p>}
              {user.website && (
                <ExtLink>
                  <Icon glyph="link" size={24} />
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={addProtocolToString(user.website)}
                  >
                    {user.website}
                  </a>
                </ExtLink>
              )}
            </CoverDescription>
          )}

          {currentUser &&
            user &&
            currentUser.id !== user.id && (
              <MessageButtonContainer>
                <Link
                  to={'/messages/new'}
                  onClick={() => this.initMessage(dispatch, user)}
                >
                  <Button>Message</Button>
                </Link>
              </MessageButtonContainer>
            )}
        </Card>
      </HoverWrapper>
    );
  }
}

const map = state => ({ currentUser: state.users.currentUser });
//$FlowFixMe
export default compose(connect(map), withRouter)(HoverProfile);
