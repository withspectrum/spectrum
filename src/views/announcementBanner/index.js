// @flow
import * as React from 'react';
import Icon from 'src/components/icons';
import { Bar, Content, Dismiss, Bold } from './style';
import { getItemFromStorage, storeItem } from 'src/helpers/localStorage';

const lsKey = 'hasDismissedAnnouncementBanner';

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
        <Content to={'/'}>
          <Icon glyph="announcement" size="24" />
          <p>
            <Bold>Spectrum is now part of GitHub!</Bold>
            Read the announcement...
          </p>
        </Content>
        <Dismiss onClick={this.dismiss}>×</Dismiss>
      </Bar>
    );
  }
}

export default Banner;
