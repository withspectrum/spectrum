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
import { FrequencyProfile } from '../../components/profile';
import { getFrequency, getFrequencyProfile } from './queries';

const FrequencyViewPure = ({ match }) => {
  const enhance = compose(withProps({ match }), getFrequency);
  const StoryFeedWithData = enhance(StoryFeed);

  const enhanceProfile = compose(withProps({ match }), getFrequencyProfile);
  const FrequencyProfileWithData = enhanceProfile(FrequencyProfile);

  return (
    <AppViewWrapper>
      <Column type="secondary">
        <FrequencyProfileWithData size="full" type="frequency" />
      </Column>
      <Column type="primary" alignItems="center">
        <StoryComposer
          activeCommunity={match.params.communityId}
          activeFrequency={match.params.frequencyId}
        />
        <StoryFeedWithData />
      </Column>
    </AppViewWrapper>
  );
};

export const FrequencyView = pure(FrequencyViewPure);
export default FrequencyView;
