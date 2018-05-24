// @flow
import React, { Fragment } from 'react';
import { TouchableOpacity } from 'react-native';
import styled, { css } from 'styled-components/native';
import Text from '../../../components/Text';
import Avatar from '../../../components/Avatar';
import Row from '../../../components/Flex/Row';
import Column from '../../../components/Flex/Column';
import ConditionalWrap from '../../../components/ConditionalWrap';
import sentencify from '../../../../shared/sentencify';
import { timeDifference } from '../../../../shared/time-difference';

import type { DirectMessageThreadInfoType } from '../../../../shared/graphql/fragments/directMessageThread/directMessageThreadInfo';

const Wrapper = styled(Row)`
  padding: 16px 8px;
  border-bottom-color: ${props => props.theme.bg.border};
  border-bottom-width: 1px;
`;

const AvatarWrapper = styled(Column)`
  margin-right: 8px;
  justify-content: center;
  width: 60px;
  align-items: center;
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
        <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>
      )}
    >
      <Wrapper>
        <AvatarWrapper>
          {participants.map(({ profilePhoto, id }) => (
            <Avatar
              key={'avatar-' + id}
              src={profilePhoto}
              size={50 / participants.length}
              radius={25 / participants.length}
            />
          ))}
        </AvatarWrapper>
        <Column style={{ flex: 1 }}>
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
        </Column>
      </Wrapper>
    </ConditionalWrap>
  );
};

export default DirectMessageThreadListItem;
