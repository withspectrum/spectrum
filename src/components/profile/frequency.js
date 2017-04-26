// @flow
import React from 'react';
import Card from '../card';
import Icon from '../icons';
import {
  ProfileHeader,
  ProfileHeaderMeta,
  Title,
  Subtitle,
  Actions,
  Action,
} from './style';

const Frequency = (props: Object): React$Element<any> => (
  <Card {...props}>
    <ProfileHeader justifyContent={'flex-start'} alignItems={'center'}>
      <ProfileHeaderMeta direction={'column'} justifyContent={'center'}>
        <Title>{props.data.title}</Title>
        <Subtitle>{props.data.subtitle}</Subtitle>
      </ProfileHeaderMeta>
    </ProfileHeader>
    <Actions>
      <Action>Follow</Action>
    </Actions>
  </Card>
);

export default Frequency;
