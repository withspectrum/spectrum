// @flow
import React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { connect } from 'react-redux';
import { openModal } from '../../actions/modals';
import ThreadComposer from '../../components/threadComposer';
import AppViewWrapper from '../../components/appViewWrapper';
import Column from '../../components/column';
import ThreadFeed from '../../components/threadFeed';
import ListCard from './components/listCard';
import { CommunityProfile } from '../../components/profile';
import { displayLoadingScreen } from '../../components/loading';
import { UpsellSignIn, Upsell404Community } from '../../components/upsell';

import {
  getCommunityThreads,
  getCommunity,
  getCommunityChannels,
} from './queries';

const CommunityThreadFeed = compose(getCommunityThreads)(ThreadFeed);

const ChannelListCard = compose(getCommunityChannels)(ListCard);

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

  console.log('community', community);

  if (!community || community.deleted) {
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
        <ChannelListCard slug={communitySlug} />
      </Column>

      <Column type="primary" alignItems="center">
        {!currentUser && <UpsellSignIn entity={community} />}

        {community.isMember && currentUser
          ? <ThreadComposer activeCommunity={communitySlug} />
          : <span />}
        <CommunityThreadFeed slug={communitySlug} />
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
