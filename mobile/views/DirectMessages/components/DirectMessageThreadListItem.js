// @flow
import React, { Fragment } from 'react';
import { TouchableHighlight } from 'react-native';
import Text from '../../../components/Text';
import ConditionalWrap from '../../../components/ConditionalWrap';
import sentencify from '../../../../shared/sentencify';

import type { DirectMessageThreadInfoType } from '../../../../shared/graphql/fragments/directMessageThread/directMessageThreadInfo';

type Props = {
  thread: DirectMessageThreadInfoType,
  currentUserId: string,
  onPress?: Function,
};

const DirectMessageThreadListItem = ({
  thread,
  currentUserId,
  onPress,
}: Props) => (
  <ConditionalWrap
    condition={!!onPress}
    wrap={children => (
      <TouchableHighlight onPress={onPress}>{children}</TouchableHighlight>
    )}
  >
    <Fragment>
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
  </ConditionalWrap>
);

export default DirectMessageThreadListItem;
