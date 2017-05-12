// @flow
import React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { connect } from 'react-redux';
import StoryComposer from '../../components/storyComposer';
import AppViewWrapper from '../../components/appViewWrapper';
import Column from '../../components/column';
import StoryFeed from '../../components/storyFeed';
import { FrequencyProfile } from '../../components/profile';
import { getFrequencyStories, getFrequency } from './queries';
import { displayLoadingScreen } from '../../components/loading';
import { UpsellSignIn } from '../../components/upsell';

const StoryFeedWithData = compose(getFrequencyStories)(StoryFeed);

const FrequencyViewPure = ({
  match,
  data: { error, frequency },
  currentUser,
}) => {
  const communitySlug = match.params.communitySlug;
  const frequencySlug = match.params.frequencySlug;

  if (error) {
    return <div>error</div>;
  }

  if (!frequency) {
    return <div>frequency not found</div>;
  }

  /*
    In the future we can check isPrivate && !isMember to handle private
    frequencies with request-to-join flows or redirects if the frequency
    shouldn't be viewable at all
  */

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
};

export const FrequencyView = compose(getFrequency, displayLoadingScreen, pure)(
  FrequencyViewPure
);
const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});
export default connect(mapStateToProps)(FrequencyView);
