// @flow
import React, { Component } from 'react';
import { View } from 'react-native';
import compose from 'recompose/compose';
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
import Loading from '../Loading';

import type { NavigationProps } from 'react-navigation';
import type { FlatListProps } from 'react-native';
import type { ThreadMessageConnectionType } from '../../../shared/graphql/fragments/thread/threadMessageConnection.js';
import type { ThreadParticipantType } from '../../../shared/graphql/fragments/thread/threadParticipant';
import type { GetUserType } from '../../../shared/graphql/queries/user/getUser';

type Props = {
  id: string,
  ...$Exact<FlatListProps>,
  isLoading: boolean,
  hasError: boolean,
  navigation: NavigationProps,
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
      ...flatListProps
    } = this.props;

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
          {...flatListProps}
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

    if (isLoading) {
      return <Loading />;
    }

    if (hasError) {
      return <Text type="body">Error :(</Text>;
    }

    return null;
  }
}

export default compose(viewNetworkHandler, withCurrentUser)(Messages);
