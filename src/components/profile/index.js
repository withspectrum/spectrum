// @flow
import React from 'react';
import compose from 'recompose/compose';
import Thread from './thread';

const ProfilePure = (props: Object): ?React$Element<any> => {
  const { type } = props;
  switch (type) {
    case 'thread': {
      return <Thread {...props} />;
    }
    default: {
      return null;
    }
  }
};

export type ProfileSizeProps =
  | 'mini'
  | 'full'
  | 'miniWithAction'
  | 'upsell'
  | 'simple'
  | 'listItemWithAction';

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
export const ThreadProfile = (props: ProfileProps) => (
  <Profile type="thread" {...props} />
);
