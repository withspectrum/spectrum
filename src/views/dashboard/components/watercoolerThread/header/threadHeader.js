// @flow
import * as React from 'react';
import {
  UserHoverProfile,
  CommunityHoverProfile,
  ChannelHoverProfile,
} from 'src/components/hoverProfile';
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
    const { active } = this.props;

    return (
      <Container active={active}>
        <MetaContainer>
          <TextRow>
            <MetaSubtitleWatercooler active={active ? 'true' : undefined}>
              Watercooler
            </MetaSubtitleWatercooler>
          </TextRow>
        </MetaContainer>
      </Container>
    );
  }
}

export default Header;
