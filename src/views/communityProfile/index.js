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
import { getCommunity } from './queries';

// const StoryFeedWithData = compose(getCommunity)(StoryFeed);

const CommunityProfilePure = ({ match }) => {
  const enhance = compose(withProps({ match }), getCommunity);
  const StoryFeedWithData = enhance(StoryFeed);

  return (
    <AppViewWrapper>
      <Column type="primary" alignItems="center">
        <StoryComposer activeCommunity={match.params.communityId} />
        <StoryFeedWithData />
      </Column>
    </AppViewWrapper>
  );
};

export const CommunityProfile = pure(CommunityProfilePure);
export default CommunityProfile;
