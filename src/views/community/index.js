// @flow
import React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { connect } from 'react-redux';
import { openModal } from '../../actions/modals';
import StoryComposer from '../../components/storyComposer';
import AppViewWrapper from '../../components/appViewWrapper';
import Column from '../../components/column';
import StoryFeed from '../../components/storyFeed';
import ListCard from './components/listCard';
import { CommunityProfile } from '../../components/profile';
import { displayLoadingScreen } from '../../components/loading';
import { UpsellSignIn, Upsell404Community } from '../../components/upsell';

import {
  getCommunityStories,
  getCommunity,
  getCommunityFrequencies,
} from './queries';

const CommunityStoryFeed = compose(getCommunityStories)(StoryFeed);

const FrequencyListCard = compose(getCommunityFrequencies)(ListCard);

const CommunityViewPure = ({
  match,
  data: { community, error },
  currentUser,
  dispatch,
}) => {
  const communitySlug = match.params.communitySlug;

  const create = () => {
    return dispatch(
      openModal('CREATE_COMMUNITY_MODAL', { name: communitySlug })
    );
  };

  if (error) {
    return <Upsell404Community community={communitySlug} />;
  }

  if (!community) {
    return <Upsell404Community community={communitySlug} create={create} />;
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
        {!currentUser && <UpsellSignIn entity={community} />}

        {community.isMember && currentUser
          ? <StoryComposer activeCommunity={communitySlug} />
          : <span />}
        <CommunityStoryFeed slug={communitySlug} />
      </Column>
    </AppViewWrapper>
  );
};

export const CommunityView = compose(getCommunity, displayLoadingScreen, pure)(
  CommunityViewPure
);

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});
export default connect(mapStateToProps)(CommunityView);
