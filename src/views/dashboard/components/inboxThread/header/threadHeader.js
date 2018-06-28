// @flow
import * as React from 'react';
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
    console.log({ viewContext });
    return (
      <Container active={active}>
        <MetaContainer>
          <TextRow>
            {author.user.username ? (
              <MetaTitle active={active} to={`/users/${author.user.username}`}>
                {author.user.name}
              </MetaTitle>
            ) : (
              <MetaTitleText active={active}>{author.user.name}</MetaTitleText>
            )}

            <Divider>·</Divider>
            <Timestamp {...this.props} />

            {watercooler && (
              <MetaSubtitleWatercooler active={active}>
                <Divider>·</Divider>
                Watercooler
              </MetaSubtitleWatercooler>
            )}

            {isLocked && (
              <MetaSubtitleLocked active={active}>
                <Divider>·</Divider>
                Locked
              </MetaSubtitleLocked>
            )}

            {isPinned && (
              <MetaSubtitlePinned active={active}>
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
                <MetaSubtitle active={active} to={`/${community.slug}`}>
                  {community.name}
                  <Divider>·</Divider>
                </MetaSubtitle>
              )}

            {viewContext !== 'channelProfile' &&
              viewContext !== 'channelInbox' && (
                <MetaSubtitle
                  active={active}
                  to={`/${community.slug}/${channel.slug}`}
                >
                  {channel.name}
                </MetaSubtitle>
              )}
          </TextRow>
        </MetaContainer>
      </Container>
    );
  }
}

export default Header;
