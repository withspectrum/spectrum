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

type UserDataProps = {
  data: {
    user: {
      uid: String,
      photoURL: String,
      displayName: String,
      username: String,
      metaData: {
        stories: Number,
      },
    },
    loading: Boolean,
    error: Boolean,
  },
};

const UserWithData = ({
  data,
  profileSize,
}: { data: UserDataProps, profileSize: ProfileSizeProps }): React$Element<
  any
> => {
  const componentSize = profileSize || 'mini';
  return (
    <Card>
      <ProfileHeader justifyContent={'flex-start'} alignItems={'center'}>
        <Avatar
          margin={'0 12px 0 0'}
          size={40}
          radius={4}
          src={data.user.photoURL}
        />
        <ProfileHeaderMeta direction={'column'} justifyContent={'center'}>
          <Title>{data.user.displayName}</Title>
          <Subtitle>{data.user.username}</Subtitle>
        </ProfileHeaderMeta>
      </ProfileHeader>

      {componentSize !== 'mini' &&
        <Actions>
          <Action>Message</Action>
        </Actions>}

      {(componentSize === 'large' || componentSize === 'full') &&
        <MetaData data={data} type="user" />}
    </Card>
  );
};

const User = compose(displayLoadingState, pure)(UserWithData);
export default User;
