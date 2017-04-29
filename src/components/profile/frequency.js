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
//$FlowFixMe
import { Link } from 'react-router-dom';
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

type FrequencyProfileProps = {
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

const FrequencyWithData = ({ data, size }): React$Element<any> => {
  const componentSize = size || 'mini';
  return (
    <Card>
      <ProfileHeader justifyContent={'flex-start'} alignItems={'center'}>
        <ProfileHeaderMeta direction={'column'} justifyContent={'center'}>
          <Link to={`/${data.frequency.community.slug}/${data.frequency.slug}`}>
            <Title>{data.frequency.name}</Title>
          </Link>
          <Link to={`/${data.frequency.community.slug}`}>
            <Subtitle>{data.frequency.community.name}</Subtitle>
          </Link>
        </ProfileHeaderMeta>
      </ProfileHeader>

      {componentSize !== 'mini' &&
        componentSize !== 'small' &&
        <Description>
          {data.frequency.description}
        </Description>}

      {componentSize !== 'mini' &&
        <Actions>
          <ActionOutline>Follow</ActionOutline>
        </Actions>}

      {(componentSize === 'large' || componentSize === 'full') &&
        <MetaData data={data} type="frequency" />}
    </Card>
  );
};

const Frequency = compose(displayLoadingState)(FrequencyWithData);
export default Frequency;
