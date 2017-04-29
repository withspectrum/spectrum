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

const CommunityWithData = ({ data, size }): React$Element<any> => {
  const componentSize = size || 'mini';

  return (
    <Card>
      <ProfileHeader justifyContent={'flex-start'} alignItems={'center'}>
        <ProfileHeaderMeta direction={'column'} justifyContent={'center'}>
          <Link to={`/${data.community.slug}`}>
            <Title>{data.community.name}</Title>
          </Link>
        </ProfileHeaderMeta>
      </ProfileHeader>

      {componentSize !== 'mini' &&
        componentSize !== 'small' &&
        <Description>
          {data.community.description}
        </Description>}

      {componentSize !== 'mini' &&
        <Actions>
          <ActionOutline>Join</ActionOutline>
        </Actions>}

      {(componentSize === 'large' || componentSize === 'full') &&
        <MetaData data={data} type="community" />}
    </Card>
  );
};

const Community = compose(displayLoadingState)(CommunityWithData);
export default Community;
