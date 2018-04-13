// @flow
import * as React from 'react';
import { track } from 'src/helpers/events';
import PageFooter from '../components/footer';
import { Wrapper } from '../style';
import {
  ContentContainer,
  Heading,
  Section,
  SectionTitle,
  SectionDescription,
} from '../pricing/style';

class FAQ extends React.Component<{}> {
  componentDidMount() {
    track('FAQ page', 'viewed', null);
  }

  render() {
    return (
      <Wrapper data-cy="faq-page">
        <ContentContainer>
          <Heading>Frequently Asked Questions</Heading>

          <Section>
            <SectionTitle>
              What happens when I delete my account on Spectrum?
            </SectionTitle>

            <SectionDescription>D</SectionDescription>
          </Section>
        </ContentContainer>
        <PageFooter />
      </Wrapper>
    );
  }
}
export default FAQ;
