// @flow
import * as React from 'react';
import {
  SectionCard,
  SectionTitle,
  SectionSubtitle,
  SectionCardFooter,
} from 'src/components/settingsViews/style';
import { PrimaryButton } from 'src/components/button';

class SettingsFallback extends React.Component<{}> {
  render() {
    return (
      <SectionCard>
        <SectionTitle>
          <span
            role="img"
            aria-label="sad emoji"
            style={{ marginRight: '8px' }}
          >
            😔
          </span>{' '}
          Something has gone wrong
        </SectionTitle>
        <SectionSubtitle>
          There was an error loading this information. Our team has been alerted
          and will fix this as soon as possible.
        </SectionSubtitle>

        <SectionCardFooter>
          <PrimaryButton onClick={() => window.location.reload(true)}>
            Refresh the page
          </PrimaryButton>
        </SectionCardFooter>
      </SectionCard>
    );
  }
}

export default SettingsFallback;
