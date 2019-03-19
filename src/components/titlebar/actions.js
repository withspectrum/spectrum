// @flow
import React from 'react';
import compose from 'recompose/compose';
import type { CommunityInfoType } from 'shared/graphql/fragments/community/communityInfo';
import type { ChannelInfoType } from 'shared/graphql/fragments/channel/channelInfo';
import type { UserInfoType } from 'shared/graphql/fragments/user/userInfo';
import Icon from 'src/components/icons';
import {
  WhiteIconButton,
  SmallPrimaryButton,
  SmallOutlineButton,
} from 'src/views/community/components/button';
import InitDirectMessageWrapper from 'src/components/initDirectMessageWrapper';
import getComposerLink from 'src/helpers/get-composer-link';
import JoinChannel from 'src/components/joinCommunityWrapper';
import JoinCommunity from 'src/components/joinCommunityWrapper';
import { withCurrentUser } from 'src/components/withCurrentUser';

type CommunityProps = {
  community: CommunityInfoType,
};

export const MobileCommunityAction = (props: CommunityProps) => {
  const { community } = props;
  const { isMember } = community.communityPermissions;
  const { pathname, search } = getComposerLink({ communityId: community.id });

  if (isMember) {
    return (
      <WhiteIconButton
        to={{
          pathname,
          search,
        }}
      >
        <Icon glyph={'post'} size={32} />
      </WhiteIconButton>
    );
  }

  return (
    <JoinCommunity
      community={community}
      render={({ isLoading }) => (
        <SmallPrimaryButton isLoading={isLoading} icon={'door-enter'}>
          {isLoading ? 'Joining...' : 'Join'}
        </SmallPrimaryButton>
      )}
    />
  );
};

type ChannelProps = {
  channel: ChannelInfoType,
};

export const MobileChannelAction = (props: ChannelProps) => {
  const { channel } = props;
  const { isMember } = channel.channelPermissions;
  const { pathname, search } = getComposerLink({
    communityId: channel.community.id,
    channelId: channel.id,
  });

  if (isMember) {
    return (
      <WhiteIconButton
        to={{
          pathname,
          search,
        }}
      >
        <Icon glyph={'post'} size={32} />
      </WhiteIconButton>
    );
  }

  return (
    <JoinChannel
      channelId={channel.id}
      render={({ isLoading }) => (
        <SmallPrimaryButton isLoading={isLoading} icon={'door-enter'}>
          {isLoading ? 'Joining...' : 'Join'}
        </SmallPrimaryButton>
      )}
    />
  );
};

type UserProps = {
  user: UserInfoType,
  currentUser: ?UserInfoType,
};

const User = (props: UserProps) => {
  const { user, currentUser } = props;

  if (currentUser && currentUser.id === user.id) {
    return (
      <SmallOutlineButton to={`/users/${currentUser.username}/settings`}>
        Settings
      </SmallOutlineButton>
    );
  }

  return (
    <InitDirectMessageWrapper
      user={user}
      render={
        <WhiteIconButton>
          <Icon glyph={'message-simple-new'} size={28} />
        </WhiteIconButton>
      }
    />
  );
};

export const MobileUserAction = compose(withCurrentUser)(User);
