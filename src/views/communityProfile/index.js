import React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
//$FlowFixMe
import withProps from 'recompose/withProps';
import StoryComposer from '../../components/storyComposer';
import AppViewWrapper from '../../components/appViewWrapper';
import Loading from '../../components/loading';
import Column from '../../components/column';
import StoryFeed from '../../components/storyFeed';
import { CommunityProfile } from '../../components/profile';
import { getCommunity, getCommunityProfile } from './queries';

const CommunityProfileViewPure = ({ match }) => {
  const enhanceStoryFeed = compose(withProps({ match }), getCommunity);
  const StoryFeedWithData = enhanceStoryFeed(StoryFeed);

  const enhanceProfile = compose(withProps({ match }), getCommunityProfile);
  const CommunityProfileWithData = enhanceProfile(CommunityProfile);

  return (
    <AppViewWrapper>
      <Column type="secondary">
        <CommunityProfileWithData size="full" />
      </Column>
      <Column type="primary" alignItems="center">
        <StoryComposer activeCommunity={match.params.communityId} />
        <StoryFeedWithData />
      </Column>
    </AppViewWrapper>
  );
};

export const CommunityProfileView = pure(CommunityProfileViewPure);
export default CommunityProfileView;
