// @flow
import React, { Component } from 'react';
import compose from 'recompose/compose';
import viewNetworkHandler from '../ViewNetworkHandler';
import Message from '../Message';
import InfiniteList from '../InfiniteList';
import { sortAndGroupMessages } from '../../../shared/clients/group-messages';
import { convertTimestampToDate } from '../../../shared/time-formatting';
import { withCurrentUser } from '../../components/WithCurrentUser';
import { UnseenRoboText, TimestampRoboText } from './RoboText';
import AuthorAvatar from './AuthorAvatar';
import AuthorName from './AuthorName';
import Loading from '../Loading';
import { FullscreenNullState } from '../NullStates';
import {
  Container,
  MessageGroupContainer,
  BubbleGroupContainer,
} from './style';

import type { NavigationProps } from 'react-navigation';
import type { FlatListProps } from 'react-native';
import type { ThreadMessageConnectionType } from '../../../shared/graphql/fragments/thread/threadMessageConnection';
import type { GetThreadMessageConnectionType } from '../../../shared/graphql/queries/thread/getThreadMessageConnection.js';
import type { ThreadParticipantType } from '../../../shared/graphql/fragments/thread/threadParticipant';
import type { GetUserType } from '../../../shared/graphql/queries/user/getUser';

type Props = {
  id: string,
  ...$Exact<FlatListProps>,
  isLoading: boolean,
  hasError: boolean,
  navigation: NavigationProps,
  currentUser: GetUserType,
  messagesDidLoad?: Function,
  data: {
    thread: {
      ...$Exact<GetThreadMessageConnectionType>,
    },
    messageConnection: {
      ...$Exact<ThreadMessageConnectionType>,
    },
  },
};

class Messages extends Component<Props> {
  componentDidUpdate(prevProps) {
    const curr = this.props;
    if (
      !prevProps.data.messageConnection &&
      curr.data.messageConnection &&
      curr.data.messageConnection.edges.length > 0
    ) {
      return this.props.messagesDidLoad && this.props.messagesDidLoad();
    }
  }

  render() {
    const {
      data,
      isLoading,
      hasError,
      navigation,
      currentUser,
      ...flatListProps
    } = this.props;

    if (data.messageConnection && data.messageConnection.edges.length > 0) {
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

            // const {
            //   isOwner: isChannelOwner,
            //   isModerator: isChannelModerator,
            // } = thread.channel.channelPermissions;
            // const {
            //   isOwner: isCommunityOwner,
            //   isModerator: isCommunityModerator,
            // } = thread.community.communityPermissions;
            // const isModerator =
            //   isChannelOwner ||
            //   isChannelModerator ||
            //   isCommunityOwner ||
            //   isCommunityModerator;
            // const canModerate =
            //   initialMessage.threadType !== 'directMessageThread' &&
            //   (me || isModerator);

            if (initialMessage.author.user.id === 'robo') {
              if (initialMessage.message.type === 'timestamp') {
                return (
                  <TimestampRoboText key={initialMessage.timestamp}>
                    {convertTimestampToDate(initialMessage.timestamp)}
                  </TimestampRoboText>
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
                <UnseenRoboText key="new-messages">New Messages</UnseenRoboText>
              );
            }

            return (
              <Container key={initialMessage.id || 'robo'} me={me}>
                {unseenRobo}

                <MessageGroupContainer>
                  <AuthorAvatar
                    onPress={() =>
                      navigation.navigate({
                        routeName: 'User',
                        key: author.user.id,
                        params: { id: author.user.id },
                      })
                    }
                    author={author}
                    me={me}
                  />

                  <BubbleGroupContainer>
                    {!me && (
                      <AuthorName
                        author={author}
                        onPress={() =>
                          navigation.navigate({
                            routeName: 'User',
                            key: author.user.id,
                            params: { id: author.user.id },
                          })
                        }
                      />
                    )}

                    {group.map(message => (
                      <Message
                        key={message.id}
                        me={me}
                        message={message}
                        threadId={this.props.id}
                      />
                    ))}
                  </BubbleGroupContainer>
                </MessageGroupContainer>
              </Container>
            );
          }}
        />
      );
    }

    if (isLoading) {
      return <Loading />;
    }

    if (hasError) {
      return <FullscreenNullState />;
    }

    return null;
  }
}

export default compose(viewNetworkHandler, withCurrentUser)(Messages);
