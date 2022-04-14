// @flow
import * as React from 'react';
import { UserHoverProfile } from 'src/components/hoverProfile';
import {
  Container,
  MetaContainer,
  TextRow,
  MetaTitle,
  MetaTitleText,
  MetaSubtitle,
  Divider,
  MetaSubtitleLocked,
  MetaSubtitleWatercooler,
  MetaSubtitlePinned,
} from './style';
import Timestamp from './timestamp';
import type { HeaderProps } from './index';

class Header extends React.Component<HeaderProps> {
  render() {
    const {
      active,
      viewContext,
      thread: { author, community, channel, id, watercooler, isLocked },
    } = this.props;

    const isPinned = id === community.pinnedThreadId;
    return (
      <Container active={active}>
        <MetaContainer>
          <TextRow>
            {author.user.username ? (
              <UserHoverProfile username={author.user.username}>
                <MetaTitle
                  active={active ? 'true' : undefined}
                  to={`/users/${author.user.username}`}
                >
                  {author.user.name}
                </MetaTitle>
              </UserHoverProfile>
            ) : (
              <MetaTitleText active={active ? 'true' : undefined}>
                {author.user.name}
              </MetaTitleText>
            )}

            <Divider>·</Divider>
            <Timestamp {...this.props} />

            {watercooler && (
              <MetaSubtitleWatercooler active={active ? 'true' : undefined}>
                <Divider>·</Divider>
                Watercooler
              </MetaSubtitleWatercooler>
            )}

            {isLocked && (
              <MetaSubtitleLocked active={active ? 'true' : undefined}>
                <Divider>·</Divider>
                Locked
              </MetaSubtitleLocked>
            )}

            {isPinned && (
              <MetaSubtitlePinned active={active ? 'true' : undefined}>
                <Divider>·</Divider>
                Pinned
              </MetaSubtitlePinned>
            )}
          </TextRow>

          <TextRow>
            {viewContext !== 'channelProfile' &&
              viewContext !== 'channelInbox' &&
              viewContext !== 'communityProfile' &&
              viewContext !== 'communityInbox' && (
                <MetaSubtitle
                  active={active ? 'true' : undefined}
                  to={`/${community.slug}`}
                >
                  {community.name}
                  <Divider>·</Divider>
                </MetaSubtitle>
              )}

            <MetaSubtitle
              active={active ? 'true' : undefined}
              to={`/${community.slug}/${channel.slug}`}
            >
              # {channel.name}
            </MetaSubtitle>
          </TextRow>
        </MetaContainer>
      </Container>
    );
  }
}

export default Header;
