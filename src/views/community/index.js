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
import ListCard from './components/listCard';
import { CommunityProfile } from '../../components/profile';

import {
  getCommunityStories,
  getCommunityProfile,
  getFrequencyInfo,
} from './queries';

const ActiveCommunityProfile = compose(getCommunityProfile)(CommunityProfile);

const CommunityStoryFeed = compose(getCommunityStories)(StoryFeed);

const FrequencyListCard = compose(getFrequencyInfo)(ListCard);

const CommunityViewPure = ({ match }) => {
  const communitySlug = match.params.communitySlug;
  return (
    <AppViewWrapper>
      <Column type="secondary">
        <ActiveCommunityProfile slug={communitySlug} profileSize="full" />
        <FrequencyListCard slug={communitySlug} />
      </Column>

      <Column type="primary" alignItems="center">
        <StoryComposer activeCommunity={match.params.communityId} />
        <CommunityStoryFeed slug={communitySlug} />
      </Column>
    </AppViewWrapper>
  );
};

export const CommunityView = pure(CommunityViewPure);
export default CommunityView;
