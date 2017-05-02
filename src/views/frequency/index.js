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
import { getFrequencyStories, getFrequencyProfile } from './queries';

const enhance = compose(getFrequencyStories);
const StoryFeedWithData = enhance(StoryFeed);

const enhanceProfile = compose(getFrequencyProfile);
const FrequencyProfileWithData = enhanceProfile(FrequencyProfile);

const FrequencyViewPure = ({ match }) => {
  const communitySlug = match.params.communitySlug;
  const communityId = match.params.communityId;
  const frequencySlug = match.params.frequencySlug;

  return (
    <AppViewWrapper>
      <Column type="secondary">
        <FrequencyProfileWithData
          slug={frequencySlug}
          community={communitySlug}
          profileSize="full"
          type="frequency"
        />
      </Column>

      <Column type="primary" alignItems="center">
        <StoryComposer
          activeCommunity={communityId}
          activeFrequency={frequencySlug}
        />
        <StoryFeedWithData slug={frequencySlug} community={communitySlug} />
      </Column>
    </AppViewWrapper>
  );
};

export const FrequencyView = pure(FrequencyViewPure);
export default FrequencyView;
