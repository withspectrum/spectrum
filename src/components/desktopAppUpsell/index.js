// @flow
import * as React from 'react';
import Icon from 'src/components/icon';
import {
  hasDismissedDesktopAppUpsell,
  dismissDesktopAppUpsell,
  isDesktopApp,
  DESKTOP_APP_MAC_URL,
} from 'src/helpers/desktop-app-utils';
import { isMac } from 'src/helpers/is-os';
import { OutlineButton } from 'src/components/button';
import {
  Container,
  Card,
  AppIcon,
  CloseIconContainer,
  Content,
  Title,
  Subtitle,
} from './style';

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
    }
  }

  close = () => {
    dismissDesktopAppUpsell();
    return this.setState({ isVisible: false });
  };

  download = () => {
    dismissDesktopAppUpsell();
    return this.setState({ isVisible: false });
  };

  render() {
    const { isVisible } = this.state;

    if (!isVisible) return null;

    return (
      <Container>
        <Card>
          <AppIcon src={'/img/homescreen-icon-72x72.png'} />
          <CloseIconContainer onClick={this.close}>
            <Icon glyph="view-close" size={20} />
          </CloseIconContainer>
          <Content>
            <Title>Download Spectrum for Mac</Title>
            <Subtitle>A better way to keep up with your communities.</Subtitle>

            <a href={DESKTOP_APP_MAC_URL} onClick={this.download}>
              <OutlineButton>Download</OutlineButton>
            </a>
          </Content>
        </Card>
      </Container>
    );
  }
}

export default DesktopAppUpsell;
