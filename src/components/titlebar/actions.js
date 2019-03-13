// @flow
import React from 'react';
import Icon from 'src/components/icons';
import {
  WhiteIconButton,
  SmallPrimaryButton,
} from 'src/views/community/components/button';
import InitDirectMessageWrapper from 'src/components/initDirectMessageWrapper';
import getComposerLink from 'src/helpers/get-composer-link';
import JoinChannel from 'src/components/joinCommunityWrapper';
import JoinCommunity from 'src/components/joinCommunityWrapper';

export const MobileCommunityAction = (props: Props) => {
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

export const MobileChannelAction = (props: Props) => {
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

export const MobileUserAction = (props: Props) => {
  const { user } = props;

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
