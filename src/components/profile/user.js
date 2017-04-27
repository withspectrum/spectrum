// @flow
import React from 'react';
import Card from '../card';
import Icon from '../icons';
import { Avatar } from '../avatar';
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
import { UserMetaData } from './metaData';

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

const User = (props: UserProfileProps): React$Element<any> => {
  const size = props.size || 'mini';
  return (
    <Card {...props}>
      <ProfileHeader justifyContent={'flex-start'} alignItems={'center'}>
        <Avatar
          margin={'0 12px 0 0'}
          size={40}
          radius={4}
          src={props.data.photoURL}
        />
        <ProfileHeaderMeta direction={'column'} justifyContent={'center'}>
          <Title>{props.data.title}</Title>
          <Subtitle>{props.data.subtitle}</Subtitle>
        </ProfileHeaderMeta>
      </ProfileHeader>

      {size !== 'mini' &&
        size !== 'small' &&
        <Description>
          {props.data.description}
        </Description>}

      {size !== 'mini' &&
        <Actions>
          <ActionOutline>Message</ActionOutline>
          {size === 'full' && <Action>Follow</Action>}
        </Actions>}

      {(size === 'large' || size === 'full') &&
        <UserMetaData type="user" id={props.data.id} />}
    </Card>
  );
};

export default User;
