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

const User = (props: Object): React$Element<any> => {
  switch (props.size) {
    case 'mini': {
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
        </Card>
      );
    }
    case 'small': {
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

          <Actions>
            <ActionOutline>Message</ActionOutline>
          </Actions>
        </Card>
      );
    }
    case 'medium': {
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

          <Description>
            {props.data.description}
          </Description>

          <Actions>
            <ActionOutline>Message</ActionOutline>
          </Actions>
        </Card>
      );
    }
    case 'large': {
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

          <Description>
            {props.data.description}
          </Description>

          <Actions>
            <ActionOutline>Message</ActionOutline>
          </Actions>

          <UserMetaData type="user" id={props.data.id} />
        </Card>
      );
    }
    case 'full': {
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

          <Description>
            {props.data.description}
          </Description>

          <Actions>
            <ActionOutline>Message</ActionOutline>
            <Action>Follow</Action>
          </Actions>

          <UserMetaData type="user" id={props.data.id} />
        </Card>
      );
    }
    default: {
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
        </Card>
      );
    }
  }
};

export default User;
