// @flow
import React from 'react';
import styled from 'styled-components/native';
import Text from '../Text';
import Avatar from '../Avatar';
import type { ThreadParticipantType } from '../../../shared/graphql/fragments/thread/threadParticipant';

type Props = {
  author: ThreadParticipantType,
  me: boolean,
  avatar: boolean,
};

const AuthorWrapper = styled.View`
  align-self: ${props => (props.me ? 'flex-end' : 'flex-start')};
  margin-bottom: 4px;
  flex-direction: row;
  align-items: flex-end;
`;

export default ({ author, me, avatar }: Props) => {
  return (
    <AuthorWrapper me={me}>
      {avatar && <Avatar src={author.user.profilePhoto} size={16} radius={8} />}
      <Text type="footnote" color={props => props.theme.text.alt}>
        <Text bold>{author.user.name}</Text> (@{author.user.username})
      </Text>
    </AuthorWrapper>
  );
};
