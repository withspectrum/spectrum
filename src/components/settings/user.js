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
import { ProfileHeader, Title, Subtitle, Actions, Action } from './style';

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
}: { data: { user: UserProps } }): React$Element<any> => {
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
      </ProfileHeader>
    </Card>
  );
};

const User = compose(displayLoadingState, pure)(UserWithData);
export default User;
