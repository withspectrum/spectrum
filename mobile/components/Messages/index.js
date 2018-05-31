// @flow
import React, { Component } from 'react';
import { View } from 'react-native';
import { withNavigation } from 'react-navigation';
import { withApollo } from 'react-apollo';
import compose from 'recompose/compose';
import Loading from '../Loading';
import viewNetworkHandler from '../ViewNetworkHandler';
import Text from '../Text';
import Message from '../Message';
import InfiniteList from '../InfiniteList';
import { ThreadMargin } from '../../views/Thread/style';
import { sortAndGroupMessages } from '../../../shared/clients/group-messages';
import { convertTimestampToDate } from '../../../src/helpers/utils';
import { withCurrentUser } from '../../components/WithCurrentUser';
import RoboText from './RoboText';
import Author from './Author';

import type { Navigation } from '../../utils/types';
import type { ThreadMessageConnectionType } from '../../../shared/graphql/fragments/thread/threadMessageConnection.js';
import type { ThreadParticipantType } from '../../../shared/graphql/fragments/thread/threadParticipant';
import type { GetUserType } from '../../../shared/graphql/queries/user/getUser';
import type { ViewNetworkHandlerProps } from '../ViewNetworkHandler';
import { getThreadByMatchQuery } from '../../../shared/graphql/queries/thread/getThread';
import type { ThreadInfoType } from '../../../shared/graphql/fragments/thread/threadInfo';

type Props = {
  id: $PropertyType<ThreadInfoType, 'id'>,
  thread: ThreadInfoType,
  ...$Exact<ViewNetworkHandlerProps>,
  navigation: Navigation,
  currentUser: GetUserType,
  data: {
    ...$Exact<ThreadMessageConnectionType>,
  },
};

class Messages extends Component<Props> {
  render() {
    const {
      data,
      isLoading,
      hasError,
      navigation,
      currentUser,
      thread,
    } = this.props;
    if (isLoading) return <Loading />;

    if (hasError) return <Text type="body">Error :(</Text>;

    if (data.messageConnection && data.messageConnection) {
      const messages = sortAndGroupMessages(
        data.messageConnection.edges
          .slice()
          .filter(Boolean)
          .map(({ node }) => node)
      );

      let hasInjectedUnseenRobo = false;

      return (
        <InfiniteList
          data={messages}
          keyExtractor={item => item[0].id}
          renderItem={({ item: group, index: i }) => {
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
            if (
              !!thread.currentUserLastSeen &&
              new Date(group[group.length - 1].timestamp).getTime() >
                new Date(thread.currentUserLastSeen).getTime() &&
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
                  <Author
                    onPress={() =>
                      navigation.navigate({
                        routeName: `User`,
                        key: author.user.id,
                        params: { id: author.user.id },
                      })
                    }
                    avatar={!me}
                    author={author}
                    me={me}
                  />
                  <View>
                    {group.map(message => {
                      return (
                        <Message
                          key={message.id}
                          me={me}
                          message={message}
                          threadId={this.props.id}
                        />
                      );
                    })}
                  </View>
                </ThreadMargin>
              </View>
            );
          }}
        />
      );
    }

    return null;
  }
}

export default compose(viewNetworkHandler, withNavigation, withCurrentUser)(
  Messages
);
