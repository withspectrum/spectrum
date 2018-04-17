// @flow
import React from 'react';
import { View } from 'react-native';
import ViewNetworkHandler from '../ViewNetworkHandler';
import Text from '../Text';
import Message from '../Message';
import { sortAndGroupMessages } from '../../../shared/clients/group-messages';

import type { ThreadMessageConnectionType } from '../../../shared/graphql/fragments/thread/threadMessageConnection.js';

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

            // if (roboText) {
            //   if (initialMessage.message.type === 'timestamp') {
            //     return (
            //       <Timestamp key={initialMessage.timestamp}>
            //         <hr />
            //         <Time>
            //           {convertTimestampToDate(initialMessage.timestamp)}
            //         </Time>
            //         <hr />
            //       </Timestamp>
            //     );
            //   } else if (
            //     initialMessage.message.type === 'unseen-messages-below' &&
            //     messages[i + 1] &&
            //     messages[i + 1].length > 0 &&
            //     messages[i + 1][0].author.id !== currentUser.id
            //   ) {
            //     return (
            //       <UnseenRobotext key={`unseen-${initialMessage.timestamp}`}>
            //         <hr />
            //         <UnseenTime>New messages</UnseenTime>
            //         <hr />
            //       </UnseenRobotext>
            //     );
            //     // Ignore any unknown robo type messages
            //   } else {
            //     return null;
            //   }
            // }

            if (roboText) return null;

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
