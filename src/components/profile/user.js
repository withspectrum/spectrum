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
  Meta,
  MetaList,
  MetaListItem,
  Label,
  Count,
} from './style';

const User = (props: Object): React$Element<any> => (
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
      <ActionOutline>Message</ActionOutline>
      <Action>Follow</Action>
    </Actions>

    <Meta>
      <MetaList>
        {props.data.meta.map((item, i) => {
          return (
            <MetaListItem key={i}>
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

export default User;
