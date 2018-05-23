// @flow
import React, { Fragment } from 'react';
import Text from '../../../components/Text';
import sentencify from '../../../../shared/sentencify';

import type { DirectMessageThreadInfoType } from '../../../../shared/graphql/fragments/directMessageThread/directMessageThreadInfo';

type Props = {
  thread: DirectMessageThreadInfoType,
  currentUserId: string,
};

const DirectMessageThreadListItem = ({ thread, currentUserId }: Props) => (
  <Fragment key={thread.id}>
    <Text type="headline">
      {sentencify(
        thread.participants
          .filter(({ userId }) => userId !== currentUserId)
          .map(({ name }) => name)
      )}
    </Text>
    <Text type="body" numberOfLines={1}>
      {thread.snippet}
    </Text>
  </Fragment>
);

export default DirectMessageThreadListItem;
