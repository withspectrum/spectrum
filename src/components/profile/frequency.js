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
//$FlowFixMe
import { connect } from 'react-redux';
import { toggleFrequencySubscriptionMutation } from '../../api/frequency';
import { addToastWithTimeout } from '../../actions/toasts';
import { LoadingCard } from '../loading';
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
import type { ProfileSizeProps } from './index';

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
  toggleFrequencySubscription,
  dispatch,
}: {
  data: { frequency: FrequencyProps },
  profileSize: ProfileSizeProps,
}): React$Element<any> => {
  const componentSize = profileSize || 'mini';

  if (!frequency) {
    return <div>No frequency to be found!</div>;
  }

  const toggleSubscription = id => {
    toggleFrequencySubscription({ id })
      .then(({ data: { toggleFrequencySubscription } }) => {
        const str = toggleFrequencySubscription.isSubscriber
          ? `Joined ${toggleFrequencySubscription.name} in ${toggleFrequencySubscription.community.name}!`
          : `Left the frequency ${toggleFrequencySubscription.name} in ${toggleFrequencySubscription.community.name}.`;

        const type = toggleFrequencySubscription.isSubscriber
          ? 'success'
          : 'neutral';
        dispatch(addToastWithTimeout(type, str));
      })
      .catch(err => {
        dispatch(addToastWithTimeout('error', err));
      });
  };

  return (
    <Card>
      <ProfileHeader justifyContent={'flex-start'} alignItems={'center'}>
        <ProfileHeaderMeta direction={'column'} justifyContent={'center'}>
          <Link to={`/${frequency.community.slug}/${frequency.slug}`}>
            <Title>{frequency.name}</Title>
          </Link>
          <Link to={`/${frequency.community.slug}`}>
            <Subtitle>{frequency.community.name}</Subtitle>
          </Link>
        </ProfileHeaderMeta>
      </ProfileHeader>

      {componentSize !== 'mini' &&
        componentSize !== 'small' &&
        <Description>
          {frequency.description}
        </Description>}

      {componentSize !== 'mini' &&
        <Actions>
          {// user owns the community, assumed member
          frequency.isOwner || frequency.community.isOwner
            ? <ActionOutline>
                <Link
                  to={`/${frequency.community.slug}/${frequency.slug}/settings`}
                >
                  Settings
                </Link>
              </ActionOutline>
            : <span />}

          {// user is a member and doesn't own the community
          frequency.isSubscriber &&
            !frequency.isOwner &&
            !frequency.community.isOwner &&
            <ActionOutline
              color={'text.alt'}
              hoverColor={'warn.default'}
              onClick={() => toggleSubscription(frequency.id)}
            >
              Unfollow {frequency.name}
            </ActionOutline>}

          {// user is not a member and doesn't own the frequency
          !frequency.isSubscriber &&
            !frequency.isOwner &&
            !frequency.community.isOwner &&
            <Action onClick={() => toggleSubscription(frequency.id)}>
              Join {frequency.name}
            </Action>}
        </Actions>}

      {(componentSize === 'large' || componentSize === 'full') &&
        <MetaData data={frequency.metaData} />}
    </Card>
  );
};

const Frequency = compose(
  toggleFrequencySubscriptionMutation,
  displayLoadingState,
  pure
)(FrequencyWithData);
export default connect()(Frequency);
