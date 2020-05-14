// @flow
import * as React from 'react';
import PageFooter from '../components/footer';
import Section from 'src/components/themedSection';
import { Wrapper } from '../style';
import { OutlineButton } from 'src/components/button';
import {
  FourUp,
  Heading,
  Copy,
  PlanSection,
  PlanPrice,
  PlanDescription,
} from '../pricing/style';
import Head from 'src/components/head';

class Support extends React.Component<{}> {
  render() {
    return (
      <Wrapper data-cy="support-page">
        <Head
          title={'Spectrum · Support'}
          description={'Questions, feedback, or just need to get in touch?'}
        />

        <Section goop={2} color={'bg.reverse'}>
          <FourUp>
            <div style={{ gridArea: 'copy' }}>
              <Heading>What can we help you with?</Heading>

              <Copy>
                Questions, feedback, or just need to get in touch? You’ve come
                to the right place.
              </Copy>
            </div>
            <PlanSection style={{ gridArea: 'one' }}>
              <div>
                <PlanPrice>Found an issue?</PlanPrice>
                <PlanDescription>
                  Join our Hugs n Bugs channel to check if there’s already a fix
                  or report a new issue.
                </PlanDescription>
              </div>

              <OutlineButton to="/spectrum/hugs-n-bugs">
                Join Hugs-n-Bugs
              </OutlineButton>
            </PlanSection>

            <PlanSection style={{ gridArea: 'two' }}>
              <div>
                <PlanPrice>Looking for a feature?</PlanPrice>
                <PlanDescription>
                  Jump into our Feature Requests channel and tell us what you
                  want or add onto existing requests from others.
                </PlanDescription>
              </div>

              <OutlineButton to="/spectrum/feature-requests">
                Request a feature
              </OutlineButton>
            </PlanSection>

            <PlanSection style={{ gridArea: 'three' }}>
              <div>
                <PlanPrice>What we’ve been working on</PlanPrice>
                <PlanDescription>
                  We post news, release notes, and threads from all over
                  Spectrum on Twitter, or directly in our community.
                </PlanDescription>
              </div>

              <OutlineButton href="https://twitter.com/withspectrum">
                Follow us on Twitter
              </OutlineButton>

              <OutlineButton to="/spectrum">Join our community</OutlineButton>
            </PlanSection>

            <PlanSection style={{ gridArea: 'four' }}>
              <div>
                <PlanPrice>Anything else?</PlanPrice>
                <PlanDescription>
                  Concerned about something on Spectrum? Shoot us an email and
                  we’ll take care of it right away.
                </PlanDescription>
              </div>

              <OutlineButton href="mailto:hi@spectrum.chat">
                Email us
              </OutlineButton>
            </PlanSection>
          </FourUp>
        </Section>

        <PageFooter />
      </Wrapper>
    );
  }
}
export default Support;
