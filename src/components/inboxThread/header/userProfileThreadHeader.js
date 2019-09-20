// @flow
import * as React from 'react';
import { UserHoverProfile } from 'src/components/hoverProfile';
import {
  Container,
  MetaContainer,
  TextRow,
  MetaTitle,
  MetaSubtitle,
  Divider,
  MetaSubtitleText,
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
      thread: { community, channel, id, watercooler, isLocked, author },
    } = this.props;

    const isPinned = id === community.pinnedThreadId;

    return (
      <Container active={active}>
        <MetaContainer>
          <TextRow>
            <MetaTitle active={active} to={`/${community.slug}`}>
              {community.name}
            </MetaTitle>

            <Divider>·</Divider>
            <Timestamp {...this.props} />
          </TextRow>

          <TextRow>
            {viewContext === 'userProfileReplies' && (
              <MetaSubtitleText>
                {author.user.username ? (
                  <UserHoverProfile username={author.user.username}>
                    <MetaSubtitle
                      active={active}
                      to={`/users/${author.user.username}`}
                    >
                      By {author.user.name}
                    </MetaSubtitle>
                  </UserHoverProfile>
                ) : (
                  <MetaSubtitleText active={active}>
                    By {author.user.name}
                  </MetaSubtitleText>
                )}

                <Divider>·</Divider>
              </MetaSubtitleText>
            )}

            <MetaSubtitle
              active={active}
              to={`/${community.slug}/${channel.slug}`}
            >
              # {channel.name}
            </MetaSubtitle>

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
        </MetaContainer>
      </Container>
    );
  }
}

export default Header;
