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
  Subtitle,
  Description,
  Actions,
  ActionOutline,
} from './style';

const displayLoadingState = branch(
  props => props.data.loading,
  renderComponent(LoadingCard)
);

type FrequencyProps = {
  id: String,
  name: String,
  slug: String,
  description: String,
  community: {
    slug: String,
    name: String,
  },
  metaData: {
    stories: Number,
    subscribers: Number,
  },
};

const FrequencyWithData = ({
  data: { frequency },
  profileSize,
}: {
  data: { frequency: FrequencyProps },
}): React$Element<any> => {
  if (!frequency) {
    return <div>No frequency to be found!</div>;
  }

  return (
    <Card>
      <ProfileHeader justifyContent={'flex-start'} alignItems={'center'} />
    </Card>
  );
};

const Frequency = compose(displayLoadingState, pure)(FrequencyWithData);
export default Frequency;
