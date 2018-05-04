// @flow
import * as React from 'react';
import { track } from 'src/helpers/events';
import Section from 'src/components/themedSection';
import PageFooter from '../components/footer';
import Icon from 'src/components/icons';
import { Discover } from 'src/components/illustrations';
import { Wrapper } from '../style';
import { Content, Heading, Subhead, Copy } from '../pricing/style';
import {
  Intro,
  TextContent,
  Waterfall,
  SectionGrid,
  FeatureList,
  Feature,
  FeatureName,
  FeatureCopy,
  Topic,
} from './style';
import type { ContextRouter } from 'react-router';

type Props = {
  ...$Exact<ContextRouter>,
};

type State = {
  ownsCommunities: boolean,
};

class Features extends React.Component<Props, State> {
  componentDidMount() {
    track('features', 'viewed', null);
  }

  render() {
    return (
      <Wrapper data-cy="features-page">
        <Section background={'blank'} goop={1} color={'brand.alt'}>
          <Intro>
            <TextContent>
              <Heading>
                Everything you need to build a great online community
              </Heading>
              <Copy>
                Spectrum was built from the ground up to make building an online
                community easy.
              </Copy>
              <Copy>
                We give you a powerful set of tools to grow your community
                organically, moderate it effectively, and measure its ROI for
                your organization.
              </Copy>
            </TextContent>
            <Waterfall src="https://spectrum.imgix.net/marketing/waterfall.png?h=0.25&dpr=2&auto=compress,format" />
          </Intro>
        </Section>
        <Section background={'brand'} goop={3} color={'space.alt'}>
          <SectionGrid reverse>
            <Topic>
              <Discover />
            </Topic>
            <FeatureList>
              <Heading reverse>
                Growing your community has never been so easy.
              </Heading>
              <Feature>
                <Icon glyph="message-fill" size="48" />
                <FeatureName>Finally, chat that scales with you</FeatureName>
                <FeatureCopy>
                  <p>
                    Live chat has become the obvious solution for building
                    communities, but most platforms quickly get noisy and
                    distracting when they start to grow.
                  </p>
                  <p>
                    We've taken the best features of modern chat platforms and
                    old-school forums and smashed them together into a format
                    that makes it easy scale to any size - even across
                    timezones.
                  </p>
                </FeatureCopy>
              </Feature>
              <Feature>
                <Icon glyph="view-fill" size="48" />
                <FeatureName>
                  Search, share, or save threads for later
                </FeatureName>
                <FeatureCopy>
                  Conversations on Spectrum are public by default which makes it
                  easy for new members to find your community right when they
                  need it.
                </FeatureCopy>
              </Feature>
              <Feature>
                <Icon glyph="profile-fill" size="48" />
                <FeatureName>Every community, only one account</FeatureName>
                <FeatureCopy>
                  <p>
                    Communities built on forums and team chat tend to require a
                    unique account for each community you join, increasing
                    friction for new members.
                  </p>
                  <p>
                    Skip managing multiple credentials and playing whack-a-mole
                    with DMs and notifications, Spectrum lets you join as many
                    communities as you want with only one account.
                  </p>
                </FeatureCopy>
              </Feature>
            </FeatureList>
          </SectionGrid>
        </Section>
        <Section background={'bright'} goop={2} color={'bg.default'}>
          <SectionGrid>
            <Topic>
              <Discover />
            </Topic>
            <FeatureList>
              <Heading reverse>
                Efficient, powerful moderation tools for any size of community
              </Heading>
              <Feature>
                <Icon glyph="like-fill" size="48" />
                <FeatureName>Granular controls</FeatureName>
                <FeatureCopy>
                  <p>
                    We give you fine-grained solutions to moderation issues via
                    individual locking, blocking, and deletion controls for each
                    thread, message, and member in your community.
                  </p>
                </FeatureCopy>
              </Feature>
              <Feature>
                <Icon glyph="rep" size="48" />
                <FeatureName>Real members. Real reputation.</FeatureName>
                <FeatureCopy>
                  <p>
                    With Spectrum's Rep system, you can see how active and
                    constructive a member is in your community - and globally
                    across communities - which makes it simple to figure out if
                    an issue is a trend or an isolated incident.
                  </p>
                </FeatureCopy>
              </Feature>
              <Feature>
                <Icon glyph="sam" size="48" />
                <FeatureName comingSoon>
                  Everyone could use a little help
                </FeatureName>
                <FeatureCopy>
                  <p>
                    Every community gets built-in toxicity monitoring and spam
                    prevention by default.
                  </p>
                  <p>
                    Identifying a problem is one thing, but it can still be hard
                    to know how to act on a moderation issue. SAM (Spectrum
                    Assistant Moderator) helps you make those decisions by
                    recommending proven solutions, automatically flagging toxic
                    messages for removal, and even addressing issues with
                    problematic members (all with your permission of course).
                  </p>
                </FeatureCopy>
              </Feature>
            </FeatureList>
          </SectionGrid>
        </Section>
        <Section goop={6} color={'bg.reverse'}>
          <SectionGrid reverse>
            <Topic>
              <Discover />
            </Topic>
            <FeatureList>
              <Heading>Measure your impact, not your usage.</Heading>
              <Feature>
                <Icon glyph="view-fill" size="48" />
                <FeatureName>Understand your community's health</FeatureName>
                <FeatureCopy>
                  <p>
                    When you add Community Analytics to your community, you'll
                    get a bird's eye view of your community's overall growth and
                    user engagement.
                  </p>
                  <p>
                    You'll also get a heads up of what types of conversations
                    are most active as well as a list of any that have gone
                    unanswered.
                  </p>
                </FeatureCopy>
              </Feature>
              <Feature>
                <Icon glyph="profile-fill" size="48" />
                <FeatureName comingSoon>Connect the dots</FeatureName>
                <FeatureCopy>
                  <p>
                    With Spectrum integrations, your community can go beyond
                    engagement to provide a convenient first-touch experience to
                    organically onboard and convert new users.
                  </p>
                </FeatureCopy>
              </Feature>
              <Feature>
                <Icon glyph="view-fill" size="48" />
                <FeatureName comingSoon>
                  Visualize your community's ROI
                </FeatureName>
                <FeatureCopy>
                  <p>
                    With Business Analytics, you can connect your user data to
                    your community's member IDs and correlate member activity to
                    customer success metrics.
                  </p>
                  <p>
                    See how member engagement directly impacts customer LTV,
                    retention, and more.
                  </p>
                </FeatureCopy>
              </Feature>
            </FeatureList>
          </SectionGrid>
        </Section>
        <Section background={'reverse'} goop={5} color={'bg.default'}>
          <SectionGrid>
            <Topic>
              <Discover />
            </Topic>
            <FeatureList>
              <Heading reverse>Build a direct pipeline to your users.</Heading>
              <Feature>
                <Icon glyph="message-fill" size="48" />
                <FeatureName>A support center with no off switch</FeatureName>
                <FeatureCopy>
                  <p>
                    Support chat and ticket systems can make it hard to provide
                    support efficiently - especially at scale.
                  </p>
                  <p>
                    Spectrum helps you and your users address issues globally
                    and searchably without the extra duplicated effort.
                  </p>
                </FeatureCopy>
              </Feature>
              <Feature>
                <Icon glyph="view-fill" size="48" />
                <FeatureName>
                  Actionable feedback that doesn't expire
                </FeatureName>
                <FeatureCopy>
                  <p>
                    Spectrum's great for collecting feature requests and user
                    feedback, and the realtime nature makes it easy for the
                    requests to adapt as you update your product.
                  </p>
                  <p>
                    Want feedback on an upcoming release? Spin up a private
                    channel for your beta testers alongside the rest of your
                    community!
                  </p>
                </FeatureCopy>
              </Feature>
              <Feature>
                <Icon glyph="profile-fill" size="48" />
                <FeatureName>
                  Develop and support your strongest advocates
                </FeatureName>
                <FeatureCopy>
                  <p>
                    When your users love your product, they want to tell others.
                    Give them the support they need to help other members with
                    custom roles and integrations.
                  </p>
                </FeatureCopy>
              </Feature>
            </FeatureList>
          </SectionGrid>
        </Section>
        <Section background={'illustrated'} goop={4} color={'bg.reverse'}>
          <Content>
            <Heading>Safety first.</Heading>
            <Copy>
              Every single community agrees to moderate according to Spectrum's
              open-source{' '}
              <a href="https://github.com/withspectrum/code-of-conduct">
                Code of Conduct
              </a>{' '}
              right off the bat. Keeping our members safe and our conversations
              constructive is key to our mission.
            </Copy>
            <Copy>
              We're not ad-driven, so we don't need to allow bots and troll
              accounts like other platforms. We're happy to help you figure out
              the best solution to any moderation issue and we provide granular
              locking, blocking, and deletion controls.
            </Copy>
            <Subhead>Get the whole team involved.</Subhead>
            <Copy>
              Need an extra set of hands to help your community grow or stay on
              top of user activity? We offer additional moderator seats as well.
            </Copy>
          </Content>
        </Section>
        <PageFooter />
      </Wrapper>
    );
  }
}
export default Features;
