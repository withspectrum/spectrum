// @flow
import React from 'react';
import Avatar from '../Avatar';
import ConditionalWrap from '../ConditionalWrap';
import type { ThreadParticipantType } from '../../../shared/graphql/fragments/thread/threadParticipant';
import TouchableHighlight from '../TouchableHighlight';
import { AuthorAvatarContainer } from './style';

type Props = {
  author: ThreadParticipantType,
  me: boolean,
  onPress?: Function,
};

const Author = ({ author, me, onPress }: Props) => {
  return (
    <ConditionalWrap
      condition={!!onPress}
      wrap={children => (
        <TouchableHighlight onPress={onPress}>{children}</TouchableHighlight>
      )}
    >
      <AuthorAvatarContainer me={me}>
        {!me && (
          <Avatar
            src={author.user.profilePhoto}
            size={24}
            style={{ marginRight: 4 }}
          />
        )}
      </AuthorAvatarContainer>
    </ConditionalWrap>
  );
};

export default Author;
