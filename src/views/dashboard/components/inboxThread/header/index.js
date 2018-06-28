// @flow
import * as React from 'react';
import { timeDifferenceShort } from 'shared/time-difference';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';
import {
  Container,
  MetaContainer,
  TextRow,
  MetaTitle,
  MetaSubtitle,
  Divider,
  Timestamp,
  Dot,
  NewThreadTimestamp,
  MetaSubtitleLocked,
  MetaSubtitleWatercooler,
  MetaSubtitlePinned,
} from './style';

type Props = {
  thread: GetThreadType,
  active: boolean,
  activeCommunity: ?Object,
  activeChannel: ?Object,
  currentUser: ?Object,
};

class Header extends React.Component<Props> {
  renderTimestamp = () => {
    const { thread, currentUser, active } = this.props;

    const now = new Date().getTime();
    const then = thread.lastActive || thread.createdAt;
    let timestamp = timeDifferenceShort(now, new Date(then).getTime());
    // show 'just now' instead of '0s' for new threads
    if (timestamp.slice(-1) === 's') {
      timestamp = 'Just now';
    }

    const createdAtTime = new Date(thread.createdAt).getTime();
    const createdMoreThanOneDayAgo = now - createdAtTime > 86400;
    const isAuthor = currentUser && currentUser.id === thread.author.user.id;

    if (
      !isAuthor &&
      !thread.currentUserLastSeen &&
      !createdMoreThanOneDayAgo &&
      !active
    ) {
      return (
        <NewThreadTimestamp active={active}>New thread</NewThreadTimestamp>
      );
    }

    const newMessagesSinceLastViewed =
      thread.currentUserLastSeen &&
      thread.lastActive &&
      thread.currentUserLastSeen < thread.lastActive;

    if (newMessagesSinceLastViewed) {
      return (
        <React.Fragment>
          <Dot color={theme => theme.warn.alt} />
          <Timestamp active={active}>{timestamp}</Timestamp>
        </React.Fragment>
      );
    }

    return <Timestamp active={active}>{timestamp}</Timestamp>;
  };

  render() {
    const {
      thread: { community, channel, watercooler, isLocked, id },
      active,
      activeCommunity,
      activeChannel,
    } = this.props;

    const isPinned = id === community.pinnedThreadId;

    return (
      <Container active={active}>
        <MetaContainer>
          {(!activeCommunity || !activeChannel) && (
            <TextRow style={{ marginBottom: '2px' }}>
              <span
                style={{ display: 'flex', flex: '1', alignItems: 'center' }}
              >
                {!activeCommunity &&
                  !activeChannel && (
                    <MetaTitle active={active} to={`/${community.slug}`}>
                      {community.name}
                    </MetaTitle>
                  )}

                {!activeChannel && (
                  <MetaSubtitle
                    active={active}
                    to={`/${community.slug}/${channel.slug}`}
                  >
                    {!activeCommunity && <Divider>{' · '}</Divider>}
                    {channel.name}
                  </MetaSubtitle>
                )}

                {watercooler && (
                  <MetaSubtitleWatercooler active={active}>
                    <Divider>{' · '}</Divider>
                    Watercooler
                  </MetaSubtitleWatercooler>
                )}

                {isLocked && (
                  <MetaSubtitleLocked active={active}>
                    <Divider>{' · '}</Divider>
                    Locked
                  </MetaSubtitleLocked>
                )}

                {isPinned && (
                  <MetaSubtitlePinned active={active}>
                    <Divider>{' · '}</Divider>
                    Pinned
                  </MetaSubtitlePinned>
                )}
              </span>

              {this.renderTimestamp()}
            </TextRow>
          )}
        </MetaContainer>
      </Container>
    );
  }
}

export default Header;
