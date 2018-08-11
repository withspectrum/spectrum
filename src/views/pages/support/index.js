// @flow
import * as React from 'react';
import PageFooter from '../components/footer';
import Section from 'src/components/themedSection';
import { Wrapper } from '../style';
import Icon from 'src/components/icon';
import { TwitterButton, PrimaryButton, Button } from 'src/components/button';
import {
  FourUp,
  Heading,
  Copy,
  PlanSection,
  PlanPrice,
  PlanDescription,
} from '../pricing/style';
import { track, events } from 'src/helpers/analytics';

class Support extends React.Component<{}> {
  componentDidMount() {
    track(events.SUPPORT_PAGE_VIEWED);
  }

  render() {
    return (
      <Wrapper data-cy="support-page">
        <Section goop={2} color={theme => theme.bg.reverse}>
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

              <Button
                fill
                to={'/spectrum/hugs-n-bugs'}
                onClick={() => track(events.SUPPORT_PAGE_REPORT_BUG)}
              >
                <Icon glyph="bug" />
                Join Hugs-n-Bugs
              </Button>
            </PlanSection>

            <PlanSection style={{ gridArea: 'two' }}>
              <div>
                <PlanPrice>Looking for a feature?</PlanPrice>
                <PlanDescription>
                  Jump into our Feature Requests channel and tell us what you
                  want or add onto existing requests from others.
                </PlanDescription>
              </div>

              <Button
                fill
                to={'/spectrum/feature-requests'}
                onClick={() => track(events.SUPPORT_PAGE_REQUEST_FEATURE)}
              >
                <Icon glyph="idea" />
                Request a feature
              </Button>
            </PlanSection>

            <PlanSection style={{ gridArea: 'three' }}>
              <div>
                <PlanPrice>What we’ve been working on</PlanPrice>
                <PlanDescription>
                  We post news, release notes, and threads from all over
                  Spectrum on Twitter, or directly in our community.
                </PlanDescription>
              </div>

              <TwitterButton
                fill
                href={'https://twitter.com/withspectrum'}
                onClick={() => track(events.SUPPORT_PAGE_FOLLOW_ON_TWITTER)}
                style={{ marginBottom: '16px' }}
              >
                <Icon glyph="twitter" />
                Follow us on Twitter
              </TwitterButton>

              <PrimaryButton
                fill
                to={'/spectrum'}
                onClick={() =>
                  track(events.SUPPORT_PAGE_JOIN_SPECTRUM_COMMUNITY)
                }
              >
                <Icon glyph="logo" />
                Join our community
              </PrimaryButton>
            </PlanSection>

            <PlanSection style={{ gridArea: 'four' }}>
              <div>
                <PlanPrice>Anything else?</PlanPrice>
                <PlanDescription>
                  Concerned about something on Spectrum? Shoot us an email and
                  we’ll take care of it right away.
                </PlanDescription>
              </div>

              <Button
                fill
                href={'mailto:hi@spectrum.chat'}
                onClick={() => track(events.SUPPORT_PAGE_EMAIL_US)}
              >
                <Icon glyph="email" />
                Email us
              </Button>
            </PlanSection>
          </FourUp>
        </Section>

        <PageFooter />
      </Wrapper>
    );
  }
}
export default Support;
