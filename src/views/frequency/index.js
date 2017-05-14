// @flow
import React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { connect } from 'react-redux';
import { toggleFrequencySubscriptionMutation } from '../../api/frequency';
import { addToastWithTimeout } from '../../actions/toasts';
import StoryComposer from '../../components/storyComposer';
import AppViewWrapper from '../../components/appViewWrapper';
import Column from '../../components/column';
import StoryFeed from '../../components/storyFeed';
import { FrequencyProfile } from '../../components/profile';
import { getFrequencyStories, getFrequency } from './queries';
import { displayLoadingScreen } from '../../components/loading';
import {
  UpsellSignIn,
  Upsell404Frequency,
  UpsellRequestToJoinFrequency,
} from '../../components/upsell';

const StoryFeedWithData = compose(getFrequencyStories)(StoryFeed);

const FrequencyViewPure = ({
  match,
  data: { error, frequency },
  currentUser,
  toggleFrequencySubscription,
  dispatch,
}) => {
  const communitySlug = match.params.communitySlug;
  const frequencySlug = match.params.frequencySlug;

  const toggleRequest = id => {
    toggleFrequencySubscription({ id })
      .then(({ data: { toggleFrequencySubscription } }) => {
        const str = toggleFrequencySubscription.isPending
          ? `Requested to join ${toggleFrequencySubscription.name} in ${toggleFrequencySubscription.community.name}!`
          : `Canceled request to join ${toggleFrequencySubscription.name} in ${toggleFrequencySubscription.community.name}.`;

        const type = toggleFrequencySubscription.isPending
          ? 'success'
          : 'neutral';
        dispatch(addToastWithTimeout(type, str));
      })
      .catch(err => {
        dispatch(addToastWithTimeout('error', err));
      });
  };

  if (error) {
    return (
      <Upsell404Frequency
        frequency={match.params.frequencySlug}
        community={match.params.communitySlug}
      />
    );
  }

  if (!frequency || frequency.deleted) {
    return (
      <Upsell404Frequency
        frequency={match.params.frequencySlug}
        community={match.params.communitySlug}
      />
    );
  }

  // user has been blocked by the owners
  if (frequency && frequency.isBlocked) {
    <Upsell404Frequency
      frequency={match.params.frequencySlug}
      community={match.params.communitySlug}
      noPermission
    />;
  }

  // frequency exists and the user is not a subscriber (accounts for signed-
  // out users as well)
  if (frequency && frequency.isPrivate && !frequency.isSubscriber) {
    return (
      <UpsellRequestToJoinFrequency
        frequency={frequency}
        community={match.params.communitySlug}
        isPending={frequency.isPending}
        subscribe={toggleRequest}
      />
    );
  }

  // frequency exists and
  // the frequency is private + user is a subscriber
  // or frequency is not private
  if (
    frequency &&
    ((frequency.isPrivate && frequency.isSubscriber) || !frequency.isPrivate)
  ) {
    return (
      <AppViewWrapper>
        <Column type="secondary">
          <FrequencyProfile data={{ frequency }} profileSize="full" />
        </Column>

        <Column type="primary" alignItems="center">
          {!currentUser && <UpsellSignIn entity={frequency} />}

          {frequency.isSubscriber && currentUser
            ? <StoryComposer
                activeCommunity={communitySlug}
                activeFrequency={match.params.frequencySlug}
              />
            : <span />}
          <StoryFeedWithData slug={frequencySlug} community={communitySlug} />
        </Column>
      </AppViewWrapper>
    );
  }
};

export const FrequencyView = compose(
  getFrequency,
  toggleFrequencySubscriptionMutation,
  displayLoadingScreen,
  pure
)(FrequencyViewPure);

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});
export default connect(mapStateToProps)(FrequencyView);
