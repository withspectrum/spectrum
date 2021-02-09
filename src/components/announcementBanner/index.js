// @flow
import * as React from 'react';
import Icon from 'src/components/icon';
import { Bar, Content, Dismiss } from './style';
import { getItemFromStorage, storeItem } from 'src/helpers/localStorage';

const lsKey = 'hasDismissedSunsetAnnouncementBanner';

type State = {
  visible: boolean,
};

class Banner extends React.Component<{}, State> {
  state = { visible: false };

  componentDidMount() {
    const hidden = getItemFromStorage(lsKey);
    if (!hidden) this.setState({ visible: true });
  }

  dismiss = () => {
    storeItem(lsKey, true);
    return this.setState({ visible: false });
  };

  render() {
    const { visible } = this.state;
    if (!visible) return null;
    return (
      <Bar>
        <Content>
          <Icon glyph="announcement" size="24" />
          <p>
            Spectrum will become read-only on August 10, 2021. Learn more about
            the decision in our{' '}
            <a
              href={
                'https://spectrum.chat/spectrum/general/join-us-on-our-new-journey~e4ca0386-f15c-4ba8-8184-21cf5fa39cf5'
              }
            >
              official announcement
            </a>
            .
          </p>
        </Content>
        <Dismiss onClick={this.dismiss}>×</Dismiss>
      </Bar>
    );
  }
}

export default Banner;
