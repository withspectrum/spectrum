// @flow
import React from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import compose from 'recompose/compose';
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
  Meta,
  MetaList,
  MetaListItem,
  Label,
  Count,
} from './style';

const ProfilePure = (props: Object): React$Element<any> => (
  <Card {...props}>
    <ProfileHeader justifyContent={'flex-start'} alignItems={'center'}>
      <Avatar size={40} radius={4} src={props.data.photoURL} />
      <ProfileHeaderMeta direction={'column'} justifyContent={'center'}>
        <Title>{props.data.title}</Title>
        <Subtitle>{props.data.subtitle}</Subtitle>
      </ProfileHeaderMeta>
    </ProfileHeader>

    <Description>
      {props.data.description}
    </Description>

    <Actions>
      <Action>Message</Action>
      <Action>Follow</Action>
    </Actions>

    <Meta>
      <MetaList>
        {props.data.meta.map(item => {
          return (
            <MetaListItem>
              <Label>
                <Icon
                  icon={item.icon}
                  color={'text.alt'}
                  hoverColor={'text.alt'}
                  scaleOnHover={false}
                  size={24}
                />
                {item.label}
              </Label>
              <Count>{item.count}</Count>
            </MetaListItem>
          );
        })}
      </MetaList>
    </Meta>
  </Card>
);

export const Profile = compose(pure)(ProfilePure);
