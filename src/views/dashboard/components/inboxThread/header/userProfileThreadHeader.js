// @flow
import * as React from 'react';
import {
  Container,
  MetaContainer,
  TextRow,
  MetaTitle,
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
      thread: { community, channel, id, watercooler, isLocked },
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
            <MetaSubtitle
              active={active}
              to={`/${community.slug}/${channel.slug}`}
            >
              {channel.name}
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
