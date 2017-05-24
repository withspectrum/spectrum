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
import Icon from '../icons';
import { Avatar } from '../avatar';
import {
  ProfileHeader,
  ProfileHeaderMeta,
  ProfileHeaderAction,
  Title,
  Description,
  Actions,
  ActionOutline,
  ExtLink,
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
  communityPermissions: {
    isOwner: Boolean,
    isMember: Boolean,
    isModerator: Boolean,
    isBlocked: Boolean,
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
        {currentUser &&
          !community.communityPermissions.isOwner &&
          <ProfileHeaderAction
            glyph={
              community.communityPermissions.isMember
                ? 'door-leave'
                : 'door-enter'
            }
            color={
              community.communityPermissions.isMember
                ? 'brand.alt'
                : 'text.placeholder'
            }
            hoverColor={
              community.communityPermissions.isMember
                ? 'brand.alt'
                : 'warn.default'
            }
            tipText={
              community.communityPermissions.isMember
                ? `Leave community`
                : 'Join community'
            }
            tipLocation="bottom-left"
            onClick={() => toggleMembership(community.id)}
          />}
        {currentUser &&
          community.communityPermissions.isOwner &&
          <Link to={`/${community.slug}/settings`}>
            <ProfileHeaderAction
              glyph="settings"
              tipText="Edit community"
              tipLocation="bottom-left"
            />
          </Link>}

      </ProfileHeader>

      {componentSize !== 'mini' &&
        componentSize !== 'small' &&
        <Description>
          <p>{community.description}</p>
          {community.website &&
            <ExtLink>
              <Icon glyph="link" size={24} />
              <a href={community.website}>
                {community.website}
              </a>
            </ExtLink>}
        </Description>}

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
