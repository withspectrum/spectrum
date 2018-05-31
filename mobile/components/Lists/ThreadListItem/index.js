// @flow
import React, { Component } from 'react';
import { ListItem } from '../ListItem';
import { TextColumnContainer, Title, Subtitle } from '../style';
import {
  MetaTextPill,
  ThreadFacepileRowContainer,
  NewMessagePill,
} from './style';
import type { GetThreadType } from '../../../../shared/graphql/queries/thread/getThread';
import ThreadCommunityInfo from './ThreadCommunityInfo';
import Facepile from '../../Facepile';
import { getThreadByMatchQuery } from '../../../../shared/graphql/queries/thread/getThread';
import type { LastSeenMap } from '../../../reducers/thread';

type Props = {
  lastSeenMap: LastSeenMap,
  thread: GetThreadType,
  activeChannel?: string,
  activeCommunity?: string,
  onPress: Function,
};

export class ThreadListItem extends Component<Props> {
  generatePillOrMessageCount = (): React$Node => {
    const { thread, activeChannel, activeCommunity, lastSeenMap } = this.props;
    const { participants, lastActive } = thread;

    const currentUserLastSeen = lastSeenMap.has(thread.id)
      ? lastSeenMap.get(thread.id)
      : null;

    if (!currentUserLastSeen) {
      return (
        <MetaTextPill offset={thread.participants.length} new>
          {'New thread!'.toUpperCase()}
        </MetaTextPill>
      );
    }

    if (currentUserLastSeen && lastActive) {
      if (currentUserLastSeen < lastActive) {
        return (
          <NewMessagePill offset={thread.participants.length}>
            New messages!
          </NewMessagePill>
        );
      }
    }

    return (
      <Subtitle>
        {thread.messageCount > 1
          ? `${thread.messageCount} messages`
          : `${thread.messageCount} message`}
      </Subtitle>
    );
  };

  render() {
    const {
      thread,
      activeChannel,
      activeCommunity,
      onPress = () => {},
    } = this.props;

    if (!thread.id) return null;
    const facepileUsers = [
      thread.author.user,
      ...thread.participants.filter(
        participant => participant && participant.id !== thread.author.user.id
      ),
    ];
    const pillOrMessageCount: React$Node = this.generatePillOrMessageCount();

    return (
      <ListItem onPress={onPress}>
        <TextColumnContainer>
          <ThreadCommunityInfo
            activeChannel={activeChannel}
            activeCommunity={activeCommunity}
            thread={thread}
          />

          <Title numberOfLines={2}>{thread.content.title}</Title>

          <ThreadFacepileRowContainer>
            <Facepile users={facepileUsers} />
            {pillOrMessageCount}
          </ThreadFacepileRowContainer>
        </TextColumnContainer>
      </ListItem>
    );
  }
}
