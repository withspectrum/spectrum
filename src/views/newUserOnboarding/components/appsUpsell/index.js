// @flow
import * as React from 'react';
import { Button, TextButton } from 'src/components/buttons';
import { track, events } from 'src/helpers/analytics';
import { ActionsContainer } from './style';
import { DESKTOP_APP_MAC_URL } from 'src/helpers/desktop-app-utils';

type Props = {
  nextStep: (step: string) => void,
  onDownload: () => void,
};

type State = {
  didDownload: boolean,
};

class AppsUpsell extends React.Component<Props, State> {
  state = { didDownload: false };

  componentDidMount() {
    track(events.USER_ONBOARDING_APPS_UPSELL_STEP_VIEWED);
  }

  onDownload = () => {
    track(events.USER_ONBOARDING_APPS_UPSELL_APP_DOWNLOADED, { app: 'mac' });
    this.props.onDownload();
    return this.setState({ didDownload: true });
  };

  render() {
    const { nextStep } = this.props;
    const { didDownload } = this.state;

    if (didDownload) {
      return (
        <ActionsContainer>
          <Button onClick={nextStep} large>
            Continue
          </Button>
        </ActionsContainer>
      );
    }

    return (
      <ActionsContainer>
        <a href={DESKTOP_APP_MAC_URL}>
          <Button large icon="apple" onClick={this.onDownload}>
            Download for Mac
          </Button>
        </a>

        <TextButton onClick={nextStep} large>
          Skip for now
        </TextButton>
      </ActionsContainer>
    );
  }
}

export default AppsUpsell;
