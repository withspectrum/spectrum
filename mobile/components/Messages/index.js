// @flow
import React, { Fragment } from 'react';
import styled from 'styled-components/native';
import { View } from 'react-native';
import { Query } from 'react-apollo';
import { getCurrentUserQuery } from '../../../shared/graphql/queries/user/getUser';
import viewNetworkHandler from '../ViewNetworkHandler';
import Text from '../Text';
import Message from '../Message';
import { ThreadMargin } from '../../views/Thread/style';
import { sortAndGroupMessages } from '../../../shared/clients/group-messages';
import { convertTimestampToDate } from '../../../src/helpers/utils';

import RoboText from './RoboText';
import Author from './Author';

import type { ThreadMessageConnectionType } from '../../../shared/graphql/fragments/thread/threadMessageConnection.js';
import type { ThreadParticipantType } from '../../../shared/graphql/fragments/thread/threadParticipant';

const TimestampWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Hr = styled.View`
  height: 1px;
  flex: 1;
  background-color: ${props => props.theme.bg.border};
`;

type Props = {
  isLoading: boolean,
  hasError: boolean,
  data: {
    ...$Exact<ThreadMessageConnectionType>,
  },
};

class Messages extends React.Component<Props> {
  render() {
    const { data, isLoading, hasError } = this.props;

    if (data.messageConnection && data.messageConnection) {
      const messages = sortAndGroupMessages(
        data.messageConnection.edges
          .slice()
          .filter(Boolean)
          .map(({ node }) => node)
      );

      let hasInjectedUnseenRobo = false;

      return (
        <Query query={getCurrentUserQuery}>
          {({ data: { user: currentUser } }) => (
            <Fragment>
              {messages.map((group, i) => {
                if (group.length === 0) return null;

                const initialMessage = group[0];
                const me = currentUser
                  ? initialMessage.author.user.id === currentUser.id
                  : false;
                // const canModerate =
                //   threadType !== 'directMessageThread' && (me || isModerator);

                if (initialMessage.author.user.id === 'robo') {
                  if (initialMessage.message.type === 'timestamp') {
                    return (
                      <RoboText key={initialMessage.timestamp}>
                        {convertTimestampToDate(initialMessage.timestamp)}
                      </RoboText>
                    );
                  }

                  // Ignore unknown robo messages
                  return null;
                }

                // Flow doesn't seem to understand that we filter the robo authors
                // (which have incorrect information, obviously) above, so this
                // has to be a thread participant
                // $FlowIssue
                const author: ThreadParticipantType = initialMessage.author;

                let unseenRobo = null;
                // TODO(@mxstbr): Figure out how to get lastSeen information
                let lastSeen = new Date('April 15, 2018 12:00:00');
                if (
                  !!lastSeen &&
                  new Date(group[group.length - 1].timestamp).getTime() >
                    new Date(lastSeen).getTime() &&
                  !me &&
                  !hasInjectedUnseenRobo
                ) {
                  hasInjectedUnseenRobo = true;
                  unseenRobo = (
                    <RoboText
                      style={{ marginTop: 8 }}
                      color={props => props.theme.warn.default}
                      key="new-messages"
                    >
                      New Messages
                    </RoboText>
                  );
                }

                return (
                  <View key={initialMessage.id || 'robo'}>
                    {unseenRobo}
                    <ThreadMargin>
                      <Author author={author} me={me} />
                      <View>
                        {group.map(message => {
                          return (
                            <Message
                              key={message.id}
                              me={me}
                              message={message}
                            />
                          );
                        })}
                      </View>
                    </ThreadMargin>
                  </View>
                );
              })}
            </Fragment>
          )}
        </Query>
      );
    }

    if (isLoading) {
      return <Text type="body">Loading...</Text>;
    }

    if (hasError) {
      return <Text type="body">Error :(</Text>;
    }

    return null;
  }
}

export default viewNetworkHandler(Messages);
