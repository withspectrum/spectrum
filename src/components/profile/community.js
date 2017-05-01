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
import { LoadingCard } from '../loading';
import {
  ProfileHeader,
  ProfileHeaderMeta,
  Title,
  Description,
  Actions,
  ActionOutline,
} from './style';
import { MetaData } from './metaData';
import type { ProfileSizeProps } from './index';

const displayLoadingState = branch(
  props => props.data.loading,
  renderComponent(LoadingCard)
);

type CommunityDataProps = {
  data: {
    community: {
      id: String,
      name: String,
      slug: String,
      metaData: {
        frequencies: Number,
        members: Number,
      },
    },
    loading: Boolean,
    error: Boolean,
  },
};

const CommunityWithData = ({
  data,
  profileSize,
}: { data: CommunityDataProps, profileSize: ProfileSizeProps }): React$Element<
  any
> => {
  const componentSize = profileSize || 'mini';

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

const Community = compose(displayLoadingState, pure)(CommunityWithData);
export default Community;
