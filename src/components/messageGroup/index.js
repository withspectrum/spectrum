// @flow
import React, { useEffect } from 'react';
import compose from 'recompose/compose';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';
import type { GetDirectMessageThreadType } from 'shared/graphql/queries/directMessageThread/getDirectMessageThread';
import type { MessageInfoType } from 'shared/graphql/fragments/message/messageInfo';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { useAppScroller } from 'src/hooks/useAppScroller';
import ThreadMessages from './thread';
import DirectMessages from './directMessage';

export type Props = {
  threadType: 'story' | 'directMessageThread',
  thread?: GetThreadType | GetDirectMessageThreadType,
  messages: Array<?MessageInfoType>,
  uniqueMessageCount: number,
};

// See https://stackoverflow.com/a/53446665
function usePrevious(value) {
  const ref = React.useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const ChatMessages = (props: Props) => {
  const { uniqueMessageCount, threadType, thread } = props;

  const { ref, scrollToBottom } = useAppScroller();

  const previousCount = usePrevious(uniqueMessageCount) || 0;
  // Scroll to bottom once the initial messages load
  useEffect(
    () => {
      if (previousCount === 0 && uniqueMessageCount > 0) {
        if (threadType === 'directMessageThread') {
          scrollToBottom();
        } else if (
          thread &&
          (thread.currentUserLastSeen || thread.watercooler)
        ) {
          scrollToBottom();
        }
      }
    },
    [uniqueMessageCount, ref]
  );

  /*
    Listen for additional messages and conditionally keep the user scrolled
    to the bottom so they always see new messages
  */
  useEffect(
    () => {
      if (ref) {
        const isNearBottom =
          ref.scrollHeight - ref.clientHeight < ref.scrollTop + 400;
        if (isNearBottom) {
          scrollToBottom();
        }
      }
    },
    [uniqueMessageCount]
  );

  if (threadType === 'story') return <ThreadMessages {...props} />;
  if (threadType === 'directMessageThread')
    return <DirectMessages {...props} />;
  return <p>Invalid threadType sent to messageGroup component</p>;
};

export default compose(withCurrentUser)(ChatMessages);
