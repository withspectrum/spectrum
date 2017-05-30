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
import { toggleCommunityMembershipMutation } from '../../api/community';
import { addToastWithTimeout } from '../../actions/toasts';
import { CoverPhoto } from '../../components/profile/coverPhoto';
import { CommunityProfile } from '../../components/profile';
import { displayLoadingScreen } from '../../components/loading';
import {
  UpsellSignIn,
  UpsellJoinCommunity,
  Upsell404Community,
} from '../../components/upsell';
import { CoverRow, CoverColumn, CoverButton } from './style';

import {
  getCommunityThreads,
  getCommunity,
  getCommunityChannels,
} from './queries';

const CommunityThreadFeed = compose(getCommunityThreads)(ThreadFeed);

const ChannelListCard = compose(getCommunityChannels)(ListCard);

const CommunityViewPure = props => {
  const {
    match,
    data: { community, error },
    currentUser,
    dispatch,
    toggleCommunityMembership,
  } = props;
  const communitySlug = match.params.communitySlug;

  const toggleMembership = communityId => {
    toggleCommunityMembership({ communityId })
      .then(({ data: { toggleCommunityMembership } }) => {
        const str = toggleCommunityMembership.communityPermissions.isMember
          ? `Joined ${toggleCommunityMembership.name}!`
          : `Left ${toggleCommunityMembership.name}.`;

        const type = toggleCommunityMembership.communityPermissions.isMember
          ? 'success'
          : 'neutral';
        dispatch(addToastWithTimeout(type, str));
      })
      .catch(err => {
        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  const create = () => {
    return dispatch(
      openModal('CREATE_COMMUNITY_MODAL', { name: communitySlug })
    );
  };

  if (error) {
    return (
      <AppViewWrapper>
        <Column type="primary">
          <Upsell404Community community={communitySlug} />
        </Column>
      </AppViewWrapper>
    );
  }

  if (!community || community.deleted) {
    return (
      <AppViewWrapper>
        <Column type="primary">
          <Upsell404Community community={communitySlug} create={create} />
        </Column>
      </AppViewWrapper>
    );
  }

  return (
    <AppViewWrapper>
      <CoverColumn>
        <CoverPhoto src={community.coverPhoto}>
          {currentUser &&
            (!community.communityPermissions.isOwner &&
              community.communityPermissions.isMember) &&
            <CoverButton
              glyph="minus-fill"
              color="bg.default"
              hoverColor="bg.default"
              opacity="0.5"
              tipText="Leave community"
              tipLocation="left"
              onClick={() => toggleMembership(community.id)}
            />}
        </CoverPhoto>
        <CoverRow>
          <Column type="secondary" className={'inset'}>
            <CommunityProfile data={{ community }} profileSize="full" />
            <ChannelListCard slug={communitySlug} />
          </Column>

          <Column type="primary">
            {!currentUser && <UpsellSignIn entity={community} />}
            {currentUser &&
              !community.communityPermissions.isMember &&
              <UpsellJoinCommunity
                community={community}
                join={toggleMembership}
              />}
            {currentUser &&
              (community.communityPermissions.isMember ||
                community.communityPermissions.isOwner) &&
              <ThreadComposer activeCommunity={communitySlug} />}
            <CommunityThreadFeed viewContext="community" slug={communitySlug} />
          </Column>
        </CoverRow>
      </CoverColumn>
    </AppViewWrapper>
  );
};

export const CommunityView = compose(
  toggleCommunityMembershipMutation,
  getCommunity,
  displayLoadingScreen,
  pure
)(CommunityViewPure);

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});
export default connect(mapStateToProps)(CommunityView);
