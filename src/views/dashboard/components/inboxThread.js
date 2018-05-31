// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Icon from '../../../components/icons';
import Facepile from './facepile';
import truncate from 'shared/truncate';
import ThreadCommunityInfo, { WaterCoolerPill } from './threadCommunityInfo';
import { changeActiveThread } from '../../../actions/dashboardFeed';
import type { ThreadInfoType } from 'shared/graphql/fragments/thread/threadInfo';
import type { Dispatch } from 'redux';
import {
  InboxThreadItem,
  InboxLinkWrapper,
  InboxThreadContent,
  ThreadTitle,
  AttachmentsContainer,
  ThreadMeta,
  StatusText,
  NewThreadPill,
  NewMessagePill,
  LockedTextPill,
  MiniLinkPreview,
  EllipsisText,
} from '../style';
import { ErrorBoundary } from 'src/components/error';

type Props = {
  active: boolean,
  dispatch: Dispatch<Object>,
  hasActiveChannel: ?string,
  hasActiveCommunity: ?string,
  history: Object,
  location: Object,
  match: Object,
  staticContext: ?string,
  data: ThreadInfoType,
  viewContext?: ?string,
  pinnedThreadId?: ?string,
};

class InboxThread extends React.Component<Props> {
  generatePillOrMessageCount = () => {
    const {
      data: {
        participants,
        isLocked,
        currentUserLastSeen,
        lastActive,
        messageCount,
        createdAt,
        channel,
        community,
      },
      data,
      active,
    } = this.props;

    if (!data) return null;

    const isChannelMember = channel.channelPermissions.isMember;
    const isCommunityMember = community.communityPermissions.isMember;

    const now = new Date().getTime() / 1000;
    const createdAtTime = new Date(createdAt).getTime() / 1000;
    const lastActiveTime = lastActive && new Date(lastActive).getTime() / 1000;

    const defaultMessageCountString = (
      <StatusText offset={participants.length} active={active}>
        {messageCount === 0
          ? `${messageCount} messages`
          : messageCount > 1
            ? `${messageCount} messages`
            : `${messageCount} message`}
      </StatusText>
    );

    if (!isChannelMember || !isCommunityMember) {
      return defaultMessageCountString;
    }

    if (isLocked) {
      return (
        <LockedTextPill offset={participants.length} active={active}>
          Locked
        </LockedTextPill>
      );
    }

    if (!currentUserLastSeen) {
      if (now - createdAtTime > 86400) {
        return defaultMessageCountString;
      }

      return (
        <NewThreadPill offset={participants.length} active={active}>
          New thread!
        </NewThreadPill>
      );
    }

    if (currentUserLastSeen && lastActive && currentUserLastSeen < lastActive) {
      if (active) return defaultMessageCountString;

      if (lastActiveTime && now - lastActiveTime > 86400 * 7) {
        return defaultMessageCountString;
      }

      return (
        <NewMessagePill offset={participants.length} active={active} newMessage>
          New messages!
        </NewMessagePill>
      );
    }

    return defaultMessageCountString;
  };
  render() {
    const {
      data: { attachments, participants, author },
      data,
      active,
      hasActiveCommunity,
      hasActiveChannel,
      viewContext,
    } = this.props;
    const attachmentsExist = attachments && attachments.length > 0;
    const participantsExist = participants && participants.length > 0;
    const isPinned = data.id === this.props.pinnedThreadId;

    if (data.watercooler) {
      return (
        <WatercoolerThread
          data={data}
          active={active}
          viewContext={viewContext}
        />
      );
    }

    return (
      <ErrorBoundary fallbackComponent={null}>
        <InboxThreadItem active={active}>
          <InboxLinkWrapper
            to={{
              pathname: window.location.pathname,
              search:
                window.innerWidth < 768 || viewContext
                  ? `?thread=${data.id}`
                  : `?t=${data.id}`,
            }}
            onClick={e =>
              window.innerWidth > 768 &&
              !viewContext &&
              !e.metaKey &&
              this.props.dispatch(changeActiveThread(data.id))
            }
          />
          <InboxThreadContent>
            <ErrorBoundary fallbackComponent={null}>
              <ThreadCommunityInfo
                thread={data}
                active={active}
                activeCommunity={hasActiveCommunity}
                activeChannel={hasActiveChannel}
                isPinned={isPinned}
              />
            </ErrorBoundary>

            <ThreadTitle active={active}>
              {truncate(data.content.title, 80)}
            </ThreadTitle>

            <ErrorBoundary fallbackComponent={null}>
              {attachmentsExist &&
                attachments
                  .filter(att => att && att.attachmentType === 'linkPreview')
                  .map(att => {
                    if (!att) return null;
                    const attData = JSON.parse(att.data);
                    const url = attData.trueUrl || attData.url;
                    if (!url) return null;

                    return (
                      <AttachmentsContainer active={active} key={url}>
                        <MiniLinkPreview
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Icon glyph="link" size={18} />
                          <EllipsisText>{url}</EllipsisText>
                        </MiniLinkPreview>
                      </AttachmentsContainer>
                    );
                  })}
            </ErrorBoundary>

            <ThreadMeta>
              {(participantsExist || author) && (
                <ErrorBoundary fallbackComponent={null}>
                  <Facepile
                    active={active}
                    participants={participants}
                    author={data.author.user}
                  />
                </ErrorBoundary>
              )}

              {this.generatePillOrMessageCount()}
            </ThreadMeta>
          </InboxThreadContent>
        </InboxThreadItem>
      </ErrorBoundary>
    );
  }
}

export default compose(connect(), withRouter)(InboxThread);

class WatercoolerThreadPure extends React.Component<Props> {
  render() {
    const {
      data: { participants, author, community, messageCount, id },
      active,
      viewContext,
    } = this.props;
    const participantsExist = participants && participants.length > 0;

    return (
      <ErrorBoundary fallbackComponent={null}>
        <InboxThreadItem active={active}>
          <InboxLinkWrapper
            to={{
              pathname: window.location.pathname,
              search:
                window.innerWidth < 768 || viewContext
                  ? `?thread=${id}`
                  : `?t=${id}`,
            }}
            onClick={() =>
              window.innerWidth > 768 &&
              this.props.dispatch(changeActiveThread(id))
            }
          />
          <InboxThreadContent>
            <WaterCoolerPill active={active} />
            <ThreadTitle active={active}>
              {community.name} Watercooler
            </ThreadTitle>

            <ThreadMeta>
              {(participantsExist || author) && (
                <ErrorBoundary fallbackComponent={null}>
                  <Facepile
                    active={active}
                    participants={participants}
                    author={author.user}
                  />
                </ErrorBoundary>
              )}

              {messageCount > 0 && (
                <StatusText offset={participants.length} active={active}>
                  {messageCount > 1
                    ? `${messageCount} messages`
                    : `${messageCount} message`}
                </StatusText>
              )}
            </ThreadMeta>
          </InboxThreadContent>
        </InboxThreadItem>
      </ErrorBoundary>
    );
  }
}

export const WatercoolerThread = compose(connect(), withRouter)(
  WatercoolerThreadPure
);
