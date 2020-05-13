// @flow
import * as React from 'react';
import Icon from 'src/components/icon';
import { Bar, Content, Dismiss } from './style';
import { getItemFromStorage, storeItem } from 'src/helpers/localStorage';

const lsKey = 'hasDismissedPrivacyTermsRedirectBanner';

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
            Spectrum has updated its{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={
                'https://help.github.com/en/github/site-policy/github-privacy-statement'
              }
            >
              Privacy Statement
            </a>
            {', and '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={
                'https://help.github.com/en/github/site-policy/github-terms-of-service'
              }
            >
              Terms of Service
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
