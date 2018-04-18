// @flow
import React, { Fragment } from 'react';
import styled from 'styled-components/native';
import { View } from 'react-native';
import ViewNetworkHandler from '../ViewNetworkHandler';
import Text from '../Text';
import Message from '../Message';
import { sortAndGroupMessages } from '../../../shared/clients/group-messages';

import RoboTimestamp from './RoboTimestamp';

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

      return (
        <View>
          {messages.map((group, i) => {
            if (group.length === 0) return null;
            // Since all messages in the group have the same Author and same initial timestamp, we only need to pull that data from the first message in the group. So let's get that message and then check who sent it.
            const initialMessage = group[0];
            const { author } = initialMessage;

            const roboText = author.user.id === 'robo';
            // const me = currentUser
            //   ? author.user && author.user.id === currentUser.id
            //   : false;
            // const canModerate =
            //   threadType !== 'directMessageThread' && (me || isModerator);

            if (roboText) {
              if (initialMessage.message.type === 'timestamp') {
                return (
                  <RoboTimestamp
                    timestamp={initialMessage.timestamp}
                    key={initialMessage.timestamp}
                  />
                );
              } else {
                // Ignore unknown robo messages
                return null;
              }
            }

            // let unseenRobo = null;
            // // If the last message in the group was sent after the thread was seen mark the entire
            // // group as last seen in the UI
            // // NOTE(@mxstbr): Maybe we should split the group eventually
            // if (
            //   !!lastSeen &&
            //   new Date(group[group.length - 1].timestamp).getTime() >
            //     new Date(lastSeen).getTime() &&
            //   !me &&
            //   !hasInjectedUnseenRobo
            // ) {
            //   hasInjectedUnseenRobo = true;
            //   unseenRobo = (
            //     <UnseenRobotext key={`unseen${initialMessage.timestamp}`}>
            //       <hr />
            //       <UnseenTime>New messages</UnseenTime>
            //       <hr />
            //     </UnseenRobotext>
            //   );
            // }

            return (
              <View key={initialMessage.id || 'robo'}>
                <View>
                  {group.map(message => {
                    return (
                      // TODO(@mxstbr): Figure out message types
                      <Message
                        key={message.id}
                        message={message}
                        type="draftjs"
                      />
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
                </View>
              </View>
            );
          })}
        </View>
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

export default ViewNetworkHandler(Messages);
