// @flow
import React from 'react';
import compose from 'recompose/compose';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';
import type { GetDirectMessageThreadType } from 'shared/graphql/queries/directMessageThread/getDirectMessageThread';
import type { MessageInfoType } from 'shared/graphql/fragments/message/messageInfo';
import { withCurrentUser } from 'src/components/withCurrentUser';
import ThreadMessages from './thread';
import DirectMessages from './directMessage';

export type Props = {
  threadType: 'story' | 'directMessageThread',
  thread?: GetThreadType | GetDirectMessageThreadType,
  messages: Array<?MessageInfoType>,
};

const ChatMessages = (props: Props) => {
  const { threadType } = props;

  if (threadType === 'story') return <ThreadMessages {...props} />;
  if (threadType === 'directMessageThread')
    return <DirectMessages {...props} />;
  return <p>Invalid threadType sent to messageGroup component</p>;
};

export default compose(withCurrentUser)(ChatMessages);
