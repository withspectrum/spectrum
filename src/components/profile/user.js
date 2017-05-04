// @flow
import React from 'react';
import Card from '../card';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
//$FlowFixMe
import renderComponent from 'recompose/renderComponent';
//$FlowFixMe
import branch from 'recompose/branch';
import { Avatar } from '../avatar';
import { LoadingCard } from '../loading';
import {
  ProfileHeader,
  ProfileHeaderMeta,
  Title,
  Subtitle,
  Actions,
  Action,
} from './style';
import { MetaData } from './metaData';
import type { ProfileSizeProps } from './index';

const displayLoadingState = branch(
  props => props.data.loading,
  renderComponent(LoadingCard)
);

type UserProps = {
  uid: String,
  photoURL: String,
  displayName: String,
  username: String,
  metaData: {
    stories: Number,
  },
};

const UserWithData = ({
  data: { user },
  profileSize,
}: { data: { user: UserProps }, profileSize: ProfileSizeProps }): React$Element<
  any
> => {
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
          <Subtitle>{user.username}</Subtitle>
        </ProfileHeaderMeta>
      </ProfileHeader>

      {componentSize !== 'mini' &&
        <Actions>
          <Action>Message</Action>
        </Actions>}

      {(componentSize === 'large' || componentSize === 'full') &&
        <MetaData data={user.metaData} />}
    </Card>
  );
};

const User = compose(displayLoadingState, pure)(UserWithData);
export default User;
