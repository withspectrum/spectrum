// @flow
import React from 'react';
import compose from 'recompose/compose';
import type { UserInfoType } from 'shared/graphql/fragments/user/userInfo';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';
import type { GetDirectMessageThreadType } from 'shared/graphql/queries/directMessageThread/getDirectMessageThread';
import type { MessageInfoType } from 'shared/graphql/fragments/message/messageInfo';
import { withCurrentUser } from 'src/components/withCurrentUser';
import ThreadMessages from './thread';
import DirectMessages from './directMessage';

type DirectMessageThreadProps = {
  threadType: 'directMessageThread',
  thread?: GetDirectMessageThreadType,
  messages: Array<?MessageInfoType>,
  currentUser: ?UserInfoType,
};

type StoryProps = {
  threadType: 'story',
  thread?: GetThreadType,
  messages: Array<?MessageInfoType>,
  currentUser: ?UserInfoType,
};

export type Props = DirectMessageThreadProps | StoryProps;

const ChatMessages = (props: Props) => {
  if (props.threadType === 'story') return <ThreadMessages {...props} />;

  // $FlowIssue
  return <DirectMessages {...props} />;
};

export default compose(withCurrentUser)(ChatMessages);
