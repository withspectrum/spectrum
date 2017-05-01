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
import { CommunityProfile } from '../../components/profile';
import { getCommunityStories, getCommunityProfile } from './queries';

const enhanceStoryFeed = compose(getCommunityStories);
const StoryFeedWithData = enhanceStoryFeed(StoryFeed);

const enhanceProfile = compose(getCommunityProfile);
const CommunityProfileWithData = enhanceProfile(CommunityProfile);

const CommunityViewPure = ({ match }) => {
  const communitySlug = match.params.communitySlug;
  return (
    <AppViewWrapper>
      <Column type="secondary">
        <CommunityProfileWithData slug={communitySlug} profileSize="full" />
      </Column>

      <Column type="primary" alignItems="center">
        <StoryComposer activeCommunity={match.params.communityId} />
        <StoryFeedWithData slug={communitySlug} />
      </Column>
    </AppViewWrapper>
  );
};

export const CommunityView = pure(CommunityViewPure);
export default CommunityView;
