// @flow
import React from 'react';
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
import { LoadingCard } from '../loading';
import {
  ProfileHeader,
  ProfileHeaderMeta,
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
  uid: string,
  photoURL: string,
  displayName: string,
  username: string,
  storyCount: number,
};

type CurrentUserProps = {
  uid: String,
  photoURL: String,
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
          src={user.photoURL}
        />
        <ProfileHeaderMeta direction={'column'} justifyContent={'center'}>
          <Title>{user.displayName}</Title>
          <Subtitle>@{user.username}</Subtitle>
        </ProfileHeaderMeta>
      </ProfileHeader>

      {componentSize !== 'mini' &&
        <Actions>
          {currentUser.uid === user.uid
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
        <MetaData data={{ stories: user.storyCount }} />}
    </Card>
  );
};

const User = compose(displayLoadingState, pure)(UserWithData);
const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});
export default connect(mapStateToProps)(User);
