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

import type { ThreadMessageConnectionType } from '../../../shared/graphql/fragments/thread/threadMessageConnection.js';

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
                // Since all messages in the group have the same Author and same initial timestamp, we only need to pull that data from the first message in the group. So let's get that message and then check who sent it.
                const initialMessage = group[0];
                const { author } = initialMessage;

                const roboText = author.user.id === 'robo';
                const me = currentUser
                  ? author.user && author.user.id === currentUser.id
                  : false;
                // const canModerate =
                //   threadType !== 'directMessageThread' && (me || isModerator);

                if (roboText) {
                  if (initialMessage.message.type === 'timestamp') {
                    return (
                      <RoboText key={initialMessage.timestamp}>
                        {convertTimestampToDate(initialMessage.timestamp)}
                      </RoboText>
                    );
                  } else {
                    // Ignore unknown robo messages
                    return null;
                  }
                }

                let unseenRobo = null;
                // TODO(@mxstbr): Figure out how to get lastSeen information
                let lastSeen = new Date('April 15, 2018 12:00:00');
                // If the last message in the group was sent after the thread was seen mark the entire
                // group as last seen in the UI
                // NOTE(@mxstbr): Maybe we should split the group eventually
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
                      {group.map(message => {
                        return (
                          <Message key={message.id} me={me} message={message} />
                        );
                        // return (
                        //   <Message
                        //     key={message.id}
                        //     message={message}
                        //     reaction={'like'}
                        //     me={me}
                        //     canModerate={canModerate}
                        //     pending={message.id < 0}
                        //     currentUser={currentUser}
                        //     threadType={threadType}
                        //     threadId={threadId}
                        //     toggleReaction={toggleReaction}
                        //     selectedId={this.state.selectedMessage}
                        //     changeSelection={this.toggleSelectedMessage}
                        //   />
                        // );
                      })}
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
