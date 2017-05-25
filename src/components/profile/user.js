// @flow
import React from 'react';
// $FlowFixMe
import { Link } from 'react-router-dom';
import Card from '../card';
//$FlowFixMe
import { connect } from 'react-redux';
//$FlowFixMe
import { withRouter } from 'react-router';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
//$FlowFixMe
import renderComponent from 'recompose/renderComponent';
//$FlowFixMe
import branch from 'recompose/branch';

import { initNewThreadWithUser } from '../../actions/directMessageThreads';

import { MetaData } from './metaData';
import type { ProfileSizeProps } from './index';
import { Avatar } from '../avatar';
import Badge from '../badges';
import { displayLoadingCard } from '../loading';
import {
  ProfileHeader,
  ProfileHeaderLink,
  ProfileHeaderMeta,
  ProfileHeaderAction,
  Title,
  Subtitle,
  Description,
} from './style';

type UserProps = {
  id: string,
  profilePhoto: string,
  displayName: string,
  name: ?string,
  username: string,
  threadCount: number,
};

type CurrentUserProps = {
  id: string,
  profilePhoto: string,
  displayName: string,
  username: string,
  name: ?string,
};

const UserWithData = ({
  data: { user },
  profileSize,
  currentUser,
  dispatch,
  history,
}: {
  data: { user: UserProps },
  profileSize: ProfileSizeProps,
  currentUser: CurrentUserProps,
  dispatch: Function,
  history: Object,
}): React$Element<any> => {
  const componentSize = profileSize || 'mini';

  if (!user) {
    return <div />;
  }

  const initMessage = () => {
    dispatch(initNewThreadWithUser(user));
    history.push('/messages/new');
  };

  return (
    <Card>
      <ProfileHeader justifyContent={'flex-start'} alignItems={'center'}>
        <ProfileHeaderLink to={`../users/${currentUser.username}`}>
          <Avatar
            margin={'0 12px 0 0'}
            size={40}
            radius={4}
            src={user.profilePhoto}
          />
          <ProfileHeaderMeta direction={'column'} justifyContent={'center'}>
            <Title>{user.name}</Title>
            <Subtitle>
              @{user.username}
              {user.isAdmin && <Badge type="admin" />}
              {/* user.isPro && <Badge type='pro' /> */}
            </Subtitle>
          </ProfileHeaderMeta>
        </ProfileHeaderLink>
        {currentUser && currentUser.id === user.id
          ? <Link to={`../users/${currentUser.username}/settings`}>
              <ProfileHeaderAction
                glyph="settings"
                tipText={`Edit profile`}
                tipLocation={'top-left'}
              />
            </Link>
          : <Link to={`/messages/${user.username}`}>
              {/* TODO: sort out this flow error */}
              <ProfileHeaderAction
                glyph="message-new"
                color="brand.alt"
                tipText={`Message ${user.name}`}
                tipLocation={'top-left'}
              />
            </Link>}
      </ProfileHeader>

      {componentSize !== 'mini' &&
        componentSize !== 'small' &&
        (user.description && user.description !== null) &&
        <Description>{user.description}</Description>}

      {(componentSize === 'large' || componentSize === 'full') &&
        <MetaData data={{ threads: user.threadCount }} />}
    </Card>
  );
};

const User = compose(displayLoadingCard, withRouter, pure)(UserWithData);
const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
  initNewThreadWithUser: state.directMessageThreads.initNewThreadWithUser,
});
export default connect(mapStateToProps)(User);
