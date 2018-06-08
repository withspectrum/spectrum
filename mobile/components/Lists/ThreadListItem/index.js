// @flow
import React, { Component } from 'react';
import { ListItem } from '../ListItem';
import { TextColumnContainer, Title, Subtitle } from '../style';
import { MetaTextPill, ThreadFacepileRowContainer } from './style';
import type { GetThreadType } from '../../../../shared/graphql/queries/thread/getThread';
import ThreadCommunityInfo from './ThreadCommunityInfo';
import Facepile from '../../Facepile';
import ErrorBoundary from '../../ErrorBoundary';

type Props = {
  thread: GetThreadType,
  activeChannel?: string,
  activeCommunity?: string,
  onPressHandler: Function,
};

export class ThreadListItem extends Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    const currProps = this.props;
    if (nextProps.thread.id !== currProps.thread.id) return true;
    if (nextProps.thread.lastActive !== currProps.thread.lastActive)
      return true;
    return false;
  }

  render() {
    const {
      thread,
      activeChannel,
      activeCommunity,
      onPressHandler,
    } = this.props;

    if (!thread.id) return null;
    const facepileUsers = [
      thread.author.user,
      ...thread.participants.filter(
        participant => participant && participant.id !== thread.author.user.id
      ),
    ];

    return (
      <ListItem onPressHandler={onPressHandler}>
        <TextColumnContainer>
          <ErrorBoundary fallbackComponent={null}>
            <ThreadCommunityInfo
              activeChannel={activeChannel}
              activeCommunity={activeCommunity}
              thread={thread}
            />
          </ErrorBoundary>

          <Title numberOfLines={2}>{thread.content.title}</Title>

          <ErrorBoundary fallbackComponent={null}>
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
          </ErrorBoundary>
        </TextColumnContainer>
      </ListItem>
    );
  }
}
