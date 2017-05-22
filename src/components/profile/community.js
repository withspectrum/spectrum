// @flow
import React from 'react';
import Card from '../card';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
//$FlowFixMe
import renderComponent from 'recompose/renderComponent';
//$FlowFixMe
import branch from 'recompose/branch';
//$FlowFixMe
import { Link } from 'react-router-dom';
//$FlowFixMe
import { connect } from 'react-redux';
import { toggleCommunityMembershipMutation } from '../../api/community';
import { addToastWithTimeout } from '../../actions/toasts';
import { LoadingCard } from '../loading';
import { Avatar } from '../avatar';
import {
  ProfileHeader,
  ProfileHeaderMeta,
  Title,
  Description,
  Actions,
  Action,
  ActionOutline,
} from './style';
import { MetaData } from './metaData';
import type { ProfileSizeProps } from './index';

const displayLoadingState = branch(
  props => props.data.loading,
  renderComponent(LoadingCard)
);

type CommunityProps = {
  id: String,
  name: String,
  slug: String,
  isMember: Boolean,
  metaData: {
    channels: Number,
    members: Number,
  },
};

const CommunityWithData = ({
  data: { community },
  profileSize,
  toggleCommunityMembership,
  data,
  dispatch,
  currentUser,
}: {
  data: { community: CommunityProps },
  profileSize: ProfileSizeProps,
}): React$Element<any> => {
  const componentSize = profileSize || 'mini';

  const toggleMembership = communityId => {
    toggleCommunityMembership({ communityId })
      .then(({ data: { toggleCommunityMembership } }) => {
        const str = toggleCommunityMembership.isMember
          ? `Joined ${toggleCommunityMembership.name}!`
          : `Left ${toggleCommunityMembership.name}.`;

        const type = toggleCommunityMembership.isMember ? 'success' : 'neutral';
        dispatch(addToastWithTimeout(type, str));
      })
      .catch(err => {
        dispatch(addToastWithTimeout('error', err));
      });
  };

  if (!community) {
    return (
      <Card>
        <ProfileHeader justifyContent={'flex-start'} alignItems={'center'}>
          <ProfileHeaderMeta direction={'column'} justifyContent={'center'}>
            <Title>This community doesn't exist yet.</Title>
          </ProfileHeaderMeta>
        </ProfileHeader>
        <Description>Want to make it?</Description>
        <Actions>
          <ActionOutline>Create</ActionOutline>
        </Actions>
      </Card>
    );
  }

  return (
    <Card>
      <ProfileHeader justifyContent={'flex-start'} alignItems={'center'}>
        <Avatar
          margin={'0 12px 0 0'}
          size={40}
          radius={4}
          src={community.profilePhoto}
        />
        <ProfileHeaderMeta direction={'column'} justifyContent={'center'}>
          <Link to={`/${community.slug}`}>
            <Title>{community.name}</Title>
          </Link>
        </ProfileHeaderMeta>
      </ProfileHeader>

      {componentSize !== 'mini' &&
        componentSize !== 'small' &&
        <Description>
          {community.description}
        </Description>}

      {componentSize !== 'mini' &&
        componentSize !== 'small' &&
        community.website &&
        <Description>
          {community.website}
        </Description>}

      {componentSize !== 'mini' &&
        currentUser &&
        <Actions>

          {// user owns the community, assumed member
          community.communityPermissions.isOwner &&
            <ActionOutline>
              <Link to={`/${community.slug}/settings`}>Settings</Link>
            </ActionOutline>}

          {// user is a member and doesn't own the community
          community.communityPermissions.isMember &&
            !community.communityPermissions.isOwner &&
            <ActionOutline
              color={'text.alt'}
              hoverColor={'warn.default'}
              onClick={() => toggleMembership(community.id)}
            >
              Leave Community
            </ActionOutline>}

          {// user is not a member and doesn't own the community
          !community.communityPermissions.isMember &&
            !community.communityPermissions.isOwner &&
            <Action onClick={() => toggleMembership(community.id)}>
              Join {community.name}
            </Action>}

        </Actions>}

      {(componentSize === 'large' || componentSize === 'full') &&
        <MetaData data={community.metaData} />}
    </Card>
  );
};

const Community = compose(
  toggleCommunityMembershipMutation,
  displayLoadingState,
  pure
)(CommunityWithData);

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});
export default connect(mapStateToProps)(Community);
