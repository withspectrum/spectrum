// @flow
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';
import { initNewThreadWithUser } from 'src/actions/directMessageThreads';
import Icon from 'src/components/icons';
import {
  WhiteIconButton,
  SmallPrimaryButton,
} from 'src/views/Community/components/Button';
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
      communityId={community.id}
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

const UserAction = (props: Props) => {
  const { user, dispatch, history } = props;

  const initMessage = () => {
    dispatch(initNewThreadWithUser(user));
    history.push('/messages/new');
  };

  return (
    <WhiteIconButton onClick={initMessage}>
      <Icon glyph={'message-simple'} size={32} />
    </WhiteIconButton>
  );
};
export const MobileUserAction = compose(
  withRouter,
  connect()
)(UserAction);
