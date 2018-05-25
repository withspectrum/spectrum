// @flow
import React, { Component } from 'react';
import { ListItem } from '../ListItem';
import { TextColumnContainer, Title, Subtitle } from '../style';
import { MetaTextPill, ThreadFacepileRowContainer } from './style';
import type { Navigation } from '../../../utils/types';
import type { GetThreadType } from '../../../../shared/graphql/queries/thread/getThread';
import ThreadCommunityInfo from './ThreadCommunityInfo';
import Facepile from '../../Facepile';

type ThreadListItemType = {
  thread: GetThreadType,
  navigation: Navigation,
  activeChannel?: string,
  activeCommunity?: string,
};

export class ThreadListItem extends Component<ThreadListItemType> {
  render() {
    const { thread, activeChannel, activeCommunity, navigation } = this.props;

    if (!thread.id) return null;
    const facepileUsers = [
      thread.author.user,
      ...thread.participants.filter(
        participant => participant && participant.id !== thread.author.user.id
      ),
    ];

    return (
      <ListItem
        onPress={() =>
          navigation.navigate({
            routeName: `Thread`,
            key: thread.id,
            params: { id: thread.id },
          })
        }
      >
        <TextColumnContainer>
          <ThreadCommunityInfo
            activeChannel={activeChannel}
            activeCommunity={activeCommunity}
            thread={thread}
          />

          <Title numberOfLines={2}>{thread.content.title}</Title>

          <ThreadFacepileRowContainer>
            <Facepile users={facepileUsers} />

            {thread.messageCount > 0 ? (
              <Subtitle>
                {thread.messageCount > 1
                  ? `${thread.messageCount} messages`
                  : `${thread.messageCount} message`}
              </Subtitle>
            ) : (
              <MetaTextPill offset={thread.participants.length} new>
                {'New thread!'.toUpperCase()}
              </MetaTextPill>
            )}
          </ThreadFacepileRowContainer>
        </TextColumnContainer>
      </ListItem>
    );
  }
}
