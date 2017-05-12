// @flow
import React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
import StoryComposer from '../../components/storyComposer';
import AppViewWrapper from '../../components/appViewWrapper';
import Column from '../../components/column';
import StoryFeed from '../../components/storyFeed';
import { FrequencyProfile } from '../../components/profile';
import { getFrequencyStories, getFrequency } from './queries';
import { displayLoadingCard } from '../../components/loading';

const StoryFeedWithData = compose(getFrequencyStories)(StoryFeed);

const FrequencyViewPure = ({ match, data: { error, frequency } }) => {
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
        {frequency.isSubscriber
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

export const FrequencyView = compose(getFrequency, displayLoadingCard, pure)(
  FrequencyViewPure
);
export default FrequencyView;
