// @flow
import React from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
import User from './user';
import Channel from './channel';
import Community from './community';
import Thread from './thread';

const ProfilePure = (props: Object): React$Element<any> => {
  const { type } = props;
  switch (type) {
    case 'user': {
      return <User {...props} />;
    }
    case 'channel': {
      return <Channel {...props} />;
    }
    case 'community': {
      return <Community {...props} />;
    }
    case 'thread': {
      return <Thread {...props} />;
    }
    default: {
      return <User {...props} />;
    }
  }
};

export type ProfileSizeProps = 'mini' | 'full';

type ProfileProps = {
  data: Object,
  profileSize?: ProfileSizeProps,
};

/*
  Create exportables which just wrap a type prop, so in the UI we can Write
  <UserProfile /> and this file will handle the type declaration, which will
  then get passed to our switch statement above to return the right component.
*/
export const Profile = compose()(ProfilePure);
export const UserProfile = (props: ProfileProps) => (
  <Profile type="user" {...props} />
);
export const ChannelProfile = (props: ProfileProps) => (
  <Profile type="channel" {...props} />
);
export const CommunityProfile = (props: ProfileProps) => (
  <Profile type="community" {...props} />
);
export const ThreadProfile = (props: ProfileProps) => (
  <Profile type="thread" {...props} />
);
