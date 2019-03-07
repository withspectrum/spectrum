// @flow
import React from 'react';
import type { ChannelActionsRowType } from '../types';
import Icon from 'src/components/icons';
import {
  WhiteIconButton,
  SmallPrimaryButton,
} from 'src/views/Community/components/Button';
import getComposerLink from 'src/helpers/get-composer-link';
import JoinChannel from './JoinCommunityWrapper';
import { MobileActionsRowContainer } from '../style';

export const MobileChannelActions = (props: ChannelActionsRowType) => {
  const { channel } = props;
  const { isMember } = channel.channelPermissions;
  const { pathname, search } = getComposerLink({
    communityId: channel.community.id,
    channelId: channel.id,
  });

  if (isMember) {
    return (
      <MobileActionsRowContainer>
        <WhiteIconButton
          to={{
            pathname,
            search,
          }}
        >
          <Icon glyph={'post'} size={32} />
        </WhiteIconButton>
      </MobileActionsRowContainer>
    );
  }

  return (
    <MobileActionsRowContainer>
      <JoinChannel
        channelId={channel.id}
        render={({ isLoading }) => (
          <SmallPrimaryButton isLoading={isLoading} icon={'door-enter'}>
            {isLoading ? 'Joining...' : 'Join'}
          </SmallPrimaryButton>
        )}
      />
    </MobileActionsRowContainer>
  );
};
