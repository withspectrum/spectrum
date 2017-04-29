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
import Loading from '../loading';
import {
  ProfileHeader,
  ProfileHeaderMeta,
  Title,
  Subtitle,
  Description,
  Actions,
  Action,
  ActionOutline,
} from './style';
import { MetaData } from './metaData';

const displayLoadingState = branch(
  props => props.data.loading,
  renderComponent(Loading)
);

type UserProfileProps = {
  size?: 'mini' | 'small' | 'medium' | 'large' | 'full',
  data: {
    title: string,
    subtitle: string,
    photoURL: string,
    description?: string,
    id?: string,
  },
  meta: Array<any>,
};

const UserWithData = ({ data, size }): React$Element<any> => {
  const componentSize = size || 'mini';
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

      {/* {componentSize !== 'mini' &&
        componentSize !== 'small' &&
        <Description>
          {data.description}
        </Description>} */}

      {componentSize !== 'mini' &&
        <Actions>
          <Action>Message</Action>
        </Actions>}

      {(componentSize === 'large' || componentSize === 'full') &&
        <MetaData data={data} type="user" />}
    </Card>
  );
};

const User = compose(displayLoadingState)(UserWithData);
export default User;
