// @flow
import * as React from 'react';
import sentencify from '../../../../shared/sentencify';
import { timeDifferenceShort } from '../../../../shared/time-difference';
import { DirectMessageListItem } from '../../../components/Lists';
import type { DirectMessageThreadInfoType } from '../../../../shared/graphql/fragments/directMessageThread/directMessageThreadInfo';

type Props = {
  thread: DirectMessageThreadInfoType,
  currentUserId: string,
  onPress: Function,
};

const DirectMessageThreadListItem = ({
  thread,
  currentUserId,
  onPress,
}: Props) => {
  const participants = thread.participants.filter(
    ({ userId }) => userId !== currentUserId
  );
  return (
    <DirectMessageListItem
      onPress={onPress}
      participants={participants}
      title={sentencify(participants.map(({ name }) => name))}
      subtitle={thread.snippet}
      timestamp={timeDifferenceShort(
        Date.now(),
        new Date(thread.threadLastActive)
      )}
    />
  );
};

export default DirectMessageThreadListItem;
