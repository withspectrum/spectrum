// @flow
import React from 'react';
import { UserAvatar } from '../avatar';
import {
  StyledMentionSuggestion,
  MentionContent,
  MentionName,
  MentionUsername,
} from './style';
import type { UserInfoType } from 'shared/graphql/fragments/user/userInfo';

type Props = {
  focused: boolean,
  search: string,
  entry: UserInfoType,
};

const MentionSuggestion = ({ entry, search, focused }: Props) => (
  <StyledMentionSuggestion focused={focused}>
    <UserAvatar size={32} user={entry} />
    <MentionContent>
      <MentionName focused={focused}>{entry.name}</MentionName>
      <MentionUsername focused={focused}>@{entry.username}</MentionUsername>
    </MentionContent>
  </StyledMentionSuggestion>
);

export default MentionSuggestion;
