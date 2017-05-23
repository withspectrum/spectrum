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
import { openModal } from '../../actions/modals';
import { initNewThreadWithUser } from '../../actions/directMessageThreads';
import { Avatar } from '../avatar';
import Badge from '../badges';
import { LoadingCard } from '../loading';
import {
  ProfileHeader,
  ProfileHeaderMeta,
  ProfileHeaderAction,
  Title,
  Subtitle,
} from './style';
import { MetaData } from './metaData';
import type { ProfileSizeProps } from './index';

const displayLoadingState = branch(
  props => props.data.loading,
  renderComponent(LoadingCard)
);

type UserProps = {
  id: string,
  profilePhoto: string,
  displayName: string,
  username: string,
  threadCount: number,
};

type CurrentUserProps = {
  id: String,
  profilePhoto: String,
  displayName: String,
  username: String,
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
}): React$Element<any> => {
  const componentSize = profileSize || 'mini';

  if (!user) {
    return <div>No user to be found!</div>;
  }

  const initMessage = () => {
    dispatch(initNewThreadWithUser(user));
    history.push('/messages/new');
  };

  return (
    <Card>
      <ProfileHeader justifyContent={'flex-start'} alignItems={'center'}>
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
        {currentUser && currentUser.id === user.id
          ? <Link to={`users/${currentUser.username}/settings`}>
              <ProfileHeaderAction glyph="settings" />
            </Link>
          : <Link to={`messages/${user.name}`}>
              <ProfileHeaderAction glyph="message-new" />
            </Link>}
      </ProfileHeader>

      {componentSize !== 'mini' &&
        currentUser &&
        <Actions>
          {currentUser && currentUser.id === user.id
            ? <ActionOutline>
                Settings
              </ActionOutline>
            : <Action onClick={() => initMessage()}>
                Message
              </Action>}
        </Actions>}

      {(componentSize === 'large' || componentSize === 'full') &&
        <MetaData data={{ threads: user.threadCount }} />}
    </Card>
  );
};

const User = compose(displayLoadingState, withRouter, pure)(UserWithData);
const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
  initNewThreadWithUser: state.directMessageThreads.initNewThreadWithUser,
});
export default connect(mapStateToProps)(User);
