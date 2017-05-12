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
import { displayLoadingCard } from '../../components/loading';

import {
  getCommunityStories,
  getCommunity,
  getCommunityFrequencies,
} from './queries';

const CommunityStoryFeed = compose(getCommunityStories)(StoryFeed);

const FrequencyListCard = compose(getCommunityFrequencies)(ListCard);

const CommunityViewPure = ({ match, data: { community, error } }) => {
  const communitySlug = match.params.communitySlug;

  if (error) {
    return <div>error</div>;
  }

  if (!community) {
    return <div>community not found</div>;
  }

  /*
    In the future we can check isPrivate && !isMember to handle private
    communities with request-to-join flows or redirects if the community
    shouldn't be viewable at all
  */

  return (
    <AppViewWrapper>
      <Column type="secondary">
        <CommunityProfile data={{ community }} profileSize="full" />
        <FrequencyListCard slug={communitySlug} />
      </Column>

      <Column type="primary" alignItems="center">
        {community.isMember
          ? <StoryComposer activeCommunity={communitySlug} />
          : <span />}
        <CommunityStoryFeed slug={communitySlug} />
      </Column>
    </AppViewWrapper>
  );
};

export const CommunityView = compose(getCommunity, displayLoadingCard, pure)(
  CommunityViewPure
);
export default CommunityView;
