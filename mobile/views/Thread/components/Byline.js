// @flow
import React from 'react';
import styled from 'styled-components/native';
import Avatar from '../../../components/Avatar';
import Text from '../../../components/Text';
import type { ThreadParticipantType } from '../../../../shared/graphql/fragments/thread/threadParticipant';

const BylineWrapper = styled.View`
  flex: 1;
  width: 100%;
`;

const Row = styled.View`
  flex-direction: row;
`;

const Column = styled.View`
  flex-direction: column;
`;

type Props = {
  author: ThreadParticipantType,
};

// TODO(@mxstbr): Make touchable and link to user profile
const Byline = ({ author }: Props) => {
  return (
    <BylineWrapper>
      <Row>
        <Avatar src={author.user.profilePhoto} size={40} radius={20} />
        <Column>
          <Row>
            <Text style={{ marginTop: 0 }} type="body" bold>
              {author.user.name}{' '}
            </Text>
            <Text style={{ marginTop: 0 }} type="body">
              @{author.user.username}
            </Text>
          </Row>
          <Text
            style={{ marginTop: 0 }}
            type="body"
            color={props => props.theme.text.alt}
          >
            Rep: {author.reputation}
          </Text>
        </Column>
      </Row>
    </BylineWrapper>
  );
};

export default Byline;
