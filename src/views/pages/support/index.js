// @flow
import * as React from 'react';
import { track } from 'src/helpers/events';
import PageFooter from '../components/footer';
import { Wrapper } from '../style';
import Link from 'src/components/link';
import { Button } from 'src/components/buttons';
import {
  ContentContainer,
  PageTitle,
  PageSubtitle,
  Section,
  SectionTitle,
  SectionDescription,
  PriceTable,
  PlanSection,
  PlanPrice,
  PlanDescription,
} from '../pricing/style';

class Support extends React.Component<{}> {
  componentDidMount() {
    track('support', 'viewed', null);
  }

  render() {
    return (
      <Wrapper data-e2e-id="support-page">
        <ContentContainer>
          <PageTitle>What can we help you with?</PageTitle>

          <PageSubtitle>
            Questions, feedback, or just need to get in touch? You’ve come to
            the right place.
          </PageSubtitle>

          <Section>
            <PriceTable>
              <PlanSection>
                <div>
                  <PlanPrice>Found a bug?</PlanPrice>
                  <PlanDescription>
                    Join our Hugs n Bugs channel to check if there’s already a
                    fix or report a new issue.
                  </PlanDescription>
                </div>

                <Link to={'/spectrum/hugs-n-bugs'}>
                  <Button
                    gradientTheme={'warn'}
                    icon={'bug'}
                    style={{ marginTop: '24px', width: '100%' }}
                  >
                    Report a bug
                  </Button>
                </Link>
              </PlanSection>

              <PlanSection>
                <div>
                  <PlanPrice>Looking for a feature?</PlanPrice>
                  <PlanDescription>
                    Jump into our Feature Requests channel and tell us what you
                    want or add onto existing requests from others.
                  </PlanDescription>
                </div>

                <Link to={'/spectrum/feature-requests'}>
                  <Button
                    gradientTheme={'space'}
                    icon={'idea'}
                    style={{ marginTop: '24px', width: '100%' }}
                  >
                    Request a feature
                  </Button>
                </Link>
              </PlanSection>

              <PlanSection>
                <div>
                  <PlanPrice>What we’ve been working on</PlanPrice>
                  <PlanDescription>
                    We post news, release notes, and threads from all over
                    Spectrum on Twitter, or directly in our community.
                  </PlanDescription>
                </div>

                <a
                  href={'https://twitter.com/withspectrum'}
                  target={'_blank'}
                  rel={'noopener noreferrer'}
                >
                  <Button
                    gradientTheme={'social.twitter'}
                    icon={'twitter'}
                    style={{ marginTop: '24px', width: '100%' }}
                  >
                    Follow us on Twitter
                  </Button>
                </a>

                <Link to={'/spectrum'}>
                  <Button
                    gradientTheme={'brand'}
                    icon={'logo'}
                    style={{ marginTop: '12px', width: '100%' }}
                  >
                    Join our community
                  </Button>
                </Link>
              </PlanSection>

              <PlanSection>
                <div>
                  <PlanPrice>Anything else?</PlanPrice>
                  <PlanDescription>
                    Concerned about something on Spectrum? Shoot us an email and
                    we’ll take care of it right away.
                  </PlanDescription>
                </div>

                <a href={'mailto:hi@spectrum.chat'}>
                  <Button
                    gradientTheme={'special'}
                    icon={'email'}
                    style={{ marginTop: '24px', width: '100%' }}
                  >
                    Email us
                  </Button>
                </a>
              </PlanSection>
            </PriceTable>
          </Section>

          <Section>
            <SectionTitle>More about us</SectionTitle>
            <SectionDescription>
              We’ve been building online communities for years, maintaining
              traditional forums, running large Slack teams, and organizing
              thriving open source projects. Through this work we recognized the
              need for a better place to build online communities, where people
              and conversations come first.
            </SectionDescription>

            <SectionDescription>
              Spectrum is currently being built by{' '}
              <a
                href="https://twitter.com/mxstbr"
                target="_blank"
                rel="noopener noreferrer"
              >
                Max Stoiber
              </a>,{' '}
              <a
                href="https://twitter.com/uberbryn"
                target="_blank"
                rel="noopener noreferrer"
              >
                Bryn Jackson
              </a>, and{' '}
              <a
                href="https://twitter.com/brian_lovin"
                target="_blank"
                rel="noopener noreferrer"
              >
                Brian Lovin
              </a>{' '}
              from San Francisco and Vienna.
            </SectionDescription>
          </Section>
        </ContentContainer>

        <PageFooter />
      </Wrapper>
    );
  }
}
export default Support;
