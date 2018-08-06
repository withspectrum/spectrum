// @// @flow
import React from 'react';
import ConditionalWrap from '../ConditionalWrap';
import type { ThreadParticipantType } from '../../../shared/graphql/fragments/thread/threadParticipant';
import TouchableHighlight from '../TouchableHighlight';
import { NameContainer, Name, Username } from './style';

type Props = {
  author: ThreadParticipantType,
  onPress?: Function,
};

const AuthorName = ({ author, onPress }: Props) => {
  return (
    <ConditionalWrap
      condition={!!onPress}
      wrap={children => (
        <TouchableHighlight onPress={onPress}>{children}</TouchableHighlight>
      )}
    >
      <NameContainer>
        <Name style={{ marginRight: 4 }}>{author.user.name}</Name>
        <Username>@{author.user.username}</Username>
      </NameContainer>
    </ConditionalWrap>
  );
};

export default AuthorName;
