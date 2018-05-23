// @flow
import React, { Fragment } from 'react';
import { TouchableHighlight } from 'react-native';
import styled from 'styled-components/native';
import Text from '../../../components/Text';
import { StackedAvatar } from '../../../components/ThreadItem/style';
import Row from '../../../components/Flex/Row';
import Column from '../../../components/Flex/Column';
import ConditionalWrap from '../../../components/ConditionalWrap';
import sentencify from '../../../../shared/sentencify';
import { timeDifference } from '../../../../shared/time-difference';

import type { DirectMessageThreadInfoType } from '../../../../shared/graphql/fragments/directMessageThread/directMessageThreadInfo';

const Wrapper = styled(Column)`
  padding: 16px 8px;
  border-bottom-color: ${props => props.theme.bg.border};
  border-bottom-width: 1px;
`;

type Props = {
  thread: DirectMessageThreadInfoType,
  currentUserId: string,
  onPress?: Function,
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
    <ConditionalWrap
      condition={!!onPress}
      wrap={children => (
        <TouchableHighlight onPress={onPress}>{children}</TouchableHighlight>
      )}
    >
      <Wrapper>
        <Row style={{ justifyContent: 'space-between' }}>
          <Text type="headline">
            {sentencify(participants.map(({ name }) => name))}
          </Text>
          <Text type="subhead" color={props => props.theme.text.alt}>
            {timeDifference(Date.now(), new Date(thread.threadLastActive))}
          </Text>
        </Row>
        <Text
          type="body"
          numberOfLines={1}
          color={props => props.theme.text.alt}
        >
          {thread.snippet}
        </Text>
        <Row style={{ marginTop: 8 }}>
          {participants.map(({ profilePhoto, id }) => (
            <StackedAvatar key={'avatar-' + id} src={profilePhoto} />
          ))}
        </Row>
      </Wrapper>
    </ConditionalWrap>
  );
};

export default DirectMessageThreadListItem;
