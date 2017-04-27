// @flow
import React from 'react';
import Card from '../card';
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
import { FrequencyMetaData } from './metaData';

const Frequency = (props: Object): React$Element<any> => {
  switch (props.size) {
    case 'mini': {
      return (
        <Card {...props}>
          <ProfileHeader justifyContent={'flex-start'} alignItems={'center'}>
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
            <ProfileHeaderMeta direction={'column'} justifyContent={'center'}>
              <Title>{props.data.title}</Title>
              <Subtitle>{props.data.subtitle}</Subtitle>
            </ProfileHeaderMeta>
          </ProfileHeader>

          <Actions>
            <ActionOutline>Follow</ActionOutline>
          </Actions>
        </Card>
      );
    }
    case 'medium': {
      return (
        <Card {...props}>
          <ProfileHeader justifyContent={'flex-start'} alignItems={'center'}>
            <ProfileHeaderMeta direction={'column'} justifyContent={'center'}>
              <Title>{props.data.title}</Title>
              <Subtitle>{props.data.subtitle}</Subtitle>
            </ProfileHeaderMeta>
          </ProfileHeader>

          <Description>
            {props.data.description}
          </Description>

          <Actions>
            <ActionOutline>Follow</ActionOutline>
          </Actions>
        </Card>
      );
    }
    case 'large': {
      return (
        <Card {...props}>
          <ProfileHeader justifyContent={'flex-start'} alignItems={'center'}>
            <ProfileHeaderMeta direction={'column'} justifyContent={'center'}>
              <Title>{props.data.title}</Title>
              <Subtitle>{props.data.subtitle}</Subtitle>
            </ProfileHeaderMeta>
          </ProfileHeader>

          <Description>
            {props.data.description}
          </Description>

          <Actions>
            <ActionOutline>Follow</ActionOutline>
          </Actions>

          <FrequencyMetaData type="frequency" id={props.data.id} />
        </Card>
      );
    }
    case 'full': {
      return (
        <Card {...props}>
          <ProfileHeader justifyContent={'flex-start'} alignItems={'center'}>
            <ProfileHeaderMeta direction={'column'} justifyContent={'center'}>
              <Title>{props.data.title}</Title>
              <Subtitle>{props.data.subtitle}</Subtitle>
            </ProfileHeaderMeta>
          </ProfileHeader>

          <Description>
            {props.data.description}
          </Description>

          <Actions>
            <ActionOutline>Follow</ActionOutline>
          </Actions>

          <FrequencyMetaData type="frequency" id={props.data.id} />
        </Card>
      );
    }
    default: {
      return (
        <Card {...props}>
          <ProfileHeader justifyContent={'flex-start'} alignItems={'center'}>
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

export default Frequency;
