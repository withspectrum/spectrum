// @flow
import React from 'react';
import styled from 'styled-components/native';
import Text from '../Text';
import Avatar from '../Avatar';
import ConditionalWrap from '../ConditionalWrap';
import compose from 'recompose/compose';
import { withNavigation } from 'react-navigation';
import type { ThreadParticipantType } from '../../../shared/graphql/fragments/thread/threadParticipant';
import type { Navigation } from '../../utils/types';
import { TouchableHighlight } from 'react-native';

type Props = {
  author: ThreadParticipantType,
  me: boolean,
  navigation: Navigation,
  onPress?: Function,
};

const AuthorWrapper = styled.View`
  align-self: ${props => (props.me ? 'flex-end' : 'flex-start')};
  margin-bottom: 4px;
  flex-direction: row;
  align-items: flex-end;
`;

const Author = ({ author, me, navigation, onPress }: Props) => {
  return (
    <ConditionalWrap
      condition={!!onPress}
      wrap={children => (
        <TouchableHighlight onPress={onPress}>{children}</TouchableHighlight>
      )}
    >
      <AuthorWrapper me={me}>
        {!me && <Avatar src={author.user.profilePhoto} size={16} radius={8} />}
        <Text type="footnote" color={props => props.theme.text.alt}>
          <Text bold>{author.user.name}</Text> (@{author.user.username})
        </Text>
      </AuthorWrapper>
    </ConditionalWrap>
  );
};

export default compose(withNavigation)(Author);
