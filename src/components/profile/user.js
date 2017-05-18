// @flow
import React from 'react';
// $FlowFixMe
import { Link } from 'react-router-dom';
import Card from '../card';
//$FlowFixMe
import { connect } from 'react-redux';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
//$FlowFixMe
import renderComponent from 'recompose/renderComponent';
//$FlowFixMe
import branch from 'recompose/branch';
import { openModal } from '../../actions/modals';
import { Avatar } from '../avatar';
import Badge from '../badges';
import { LoadingCard } from '../loading';
import {
  ProfileHeader,
  ProfileHeaderMeta,
  ProfileHeaderAction,
  Title,
  Subtitle,
  Actions,
  Action,
  ActionOutline,
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
}: {
  data: { user: UserProps },
  profileSize: ProfileSizeProps,
  currentUser: CurrentUserProps,
}): React$Element<any> => {
  const componentSize = profileSize || 'mini';

  if (!user) {
    return <div>No user to be found!</div>;
  }

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
          <Title>{user.displayName}</Title>
          <Subtitle>
            @{user.username}
            {user.isAdmin && <Badge type="admin" />}
            {/* user.isPro && <Badge type='pro' /> */}
          </Subtitle>
        </ProfileHeaderMeta>
        <Link to={`users/${currentUser.username}/settings`}>
          <ProfileHeaderAction glyph="settings" />
        </Link>
      </ProfileHeader>

      {componentSize !== 'mini' &&
        currentUser &&
        <Actions>
          {currentUser && currentUser.id === user.id
            ? <ActionOutline
                onClick={() =>
                  dispatch(
                    openModal('USER_PROFILE_MODAL', { user: currentUser })
                  )}
              >
                Settings
              </ActionOutline>
            : <Action>Message</Action>}
        </Actions>}

      {(componentSize === 'large' || componentSize === 'full') &&
        <MetaData data={{ threads: user.threadCount }} />}
    </Card>
  );
};

const User = compose(displayLoadingState, pure)(UserWithData);
const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});
export default connect(mapStateToProps)(User);
