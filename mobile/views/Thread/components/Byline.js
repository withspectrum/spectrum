// @flow
import React from 'react';
import styled from 'styled-components/native';
import Avatar from '../../../components/Avatar';
import Text from '../../../components/Text';
import { Row } from '../../../components/Flex';
import Column from '../../../components/Flex/Column';
import compose from 'recompose/compose';
import type { Navigation } from '../../../utils/types';
import type { ThreadParticipantType } from '../../../../shared/graphql/fragments/thread/threadParticipant';
import { withNavigation } from 'react-navigation';
import { TouchableHighlight } from 'react-native';

const BylineWrapper = styled.View`
  flex: 1;
  width: 100%;
`;

type Props = {
  author: ThreadParticipantType,
  navigation: Navigation,
};

// TODO(@mxstbr): Make touchable and link to user profile
const Byline = ({ author, navigation }: Props) => {
  return (
    <TouchableHighlight
      onPress={() => navigation.navigate(`User`, { id: author.user.id })}
    >
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
    </TouchableHighlight>
  );
};

export default compose(withNavigation)(Byline);
