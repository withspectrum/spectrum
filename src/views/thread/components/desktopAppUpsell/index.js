// @flow
import * as React from 'react';
import { track, events } from 'src/helpers/analytics';
import {
  hasDismissedDesktopAppUpsell,
  dismissDesktopAppUpsell,
  isDesktopApp,
  DESKTOP_APP_MAC_URL,
} from 'src/helpers/desktop-app-utils';
import { isMac } from 'src/helpers/is-os';
import { OutlineButton } from 'src/components/buttons';
import { SidebarSection } from '../../style';
import { Container, Card, AppIcon, Content, Title, Subtitle } from './style';

type State = {
  isVisible: boolean,
};

class DesktopAppUpsell extends React.Component<{}, State> {
  constructor() {
    super();

    this.state = {
      isVisible: false,
    };
  }

  componentDidMount() {
    const desktopUpsellVisible =
      isMac() && !isDesktopApp() && !hasDismissedDesktopAppUpsell();

    if (desktopUpsellVisible) {
      this.setState({ isVisible: true });
      track(events.THREAD_VIEW_DOWNLOAD_MAC_VIEWED);
    }
  }

  download = () => {
    track(events.THREAD_VIEW_DOWNLOAD_MAC_CLICKED);
    dismissDesktopAppUpsell();
  };

  render() {
    const { isVisible } = this.state;

    if (!isVisible) return null;

    return (
      <SidebarSection>
        <Container>
          <Card>
            <AppIcon src={'/img/homescreen-icon-72x72.png'} />

            <Content>
              <Title>Download Spectrum for Mac</Title>
              <Subtitle>
                A better way to keep up with your communities.
              </Subtitle>

              <a href={DESKTOP_APP_MAC_URL} onClick={this.download}>
                <OutlineButton>Download</OutlineButton>
              </a>
            </Content>
          </Card>
        </Container>
      </SidebarSection>
    );
  }
}

export default DesktopAppUpsell;
