// @flow
import React from 'react';
import styled from 'styled-components/native';
import Avatar from '../../../components/Avatar';
import Text from '../../../components/Text';
import type { ThreadParticipantType } from '../../../../shared/graphql/fragments/thread/threadParticipant';

const BylineWrapper = styled.View`
  flex: 1;
  width: 100%;
  flex-direction: row;
  margin: 16px;
`;

type Props = {
  author: ThreadParticipantType,
};

// TODO(@mxstbr): Make touchable and link to user profile
export default ({ author }: Props) => {
  return (
    <BylineWrapper>
      <Avatar src={author.user.profilePhoto} size={40} radius={20} />
      <Text type="body" bold>
        {author.user.name}{' '}
      </Text>
      <Text type="body">@{author.user.username} </Text>
      <Text type="body">{author.reputation} </Text>
    </BylineWrapper>
  );
};
