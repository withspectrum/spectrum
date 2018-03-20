// @flow
import * as React from 'react';
import { track } from 'src/helpers/events';
import { ContactInfo, TermsSection } from '../view';
import PageFooter from '../components/footer';
import { Wrapper } from '../style';

class Support extends React.Component<{}> {
  componentDidMount() {
    track('support', 'viewed', null);
  }

  render() {
    return (
      <Wrapper data-e2e-id="support-page">
        <ContactInfo />
        <TermsSection />
        <PageFooter />
      </Wrapper>
    );
  }
}
export default Support;
