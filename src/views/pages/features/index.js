// @flow
import * as React from 'react';
import Section from 'src/components/themedSection';
import PageFooter from '../components/footer';
import Icon from 'src/components/icon';
import { Easy, Happy, Impact, Ideas } from 'src/components/illustrations';
import { Wrapper } from '../style';
import { Heading, Copy } from '../pricing/style';
import { PrimaryButton } from 'src/components/button';
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
  EtcFeature,
  EtcGrid,
  EtcName,
  EtcCTA,
} from './style';
import type { ContextRouter } from 'react-router';
import Head from 'src/components/head';

type Props = {
  ...$Exact<ContextRouter>,
};

type State = {
  ownsCommunities: boolean,
};

class Features extends React.Component<Props, State> {
  render() {
    return (
      <Wrapper data-cy="features-page">
        <Head title={'Spectrum · Features'} />

        <Section background={'blank'} goop={1} color={'brand.alt'}>
          <Intro>
            <TextContent>
              <Heading>
                Everything you need to build a great online community
              </Heading>
              <Copy style={{ marginBottom: '32px' }}>
                We give you a powerful set of tools to grow your community
                organically, moderate it effectively, and measure its ROI for
                your organization.
              </Copy>
              <PrimaryButton to={'/new/community'}>Get started</PrimaryButton>
            </TextContent>
            <Waterfall src="/img/waterfall.png" />
          </Intro>
        </Section>
        <Section background={'brand'} goop={3} color={'space.alt'}>
          <SectionGrid reverse>
            <Topic>
              <Easy />
            </Topic>
            <FeatureList>
              <Heading reverse>
                Growing your community has never been so easy.
              </Heading>
              <Feature>
                <Icon glyph="message" size="48" />
                <FeatureName>Finally, chat that scales</FeatureName>
                <FeatureCopy>
                  <p>
                    We’ve taken the best features of modern chat platforms and
                    old-school forums and smashed them together into a format
                    that makes it easy scale to any size - even across
                    timezones.
                  </p>
                </FeatureCopy>
              </Feature>
              <Feature>
                <Icon glyph="link" size="48" />
                <FeatureName>Location, location, location</FeatureName>
                <FeatureCopy>
                  <p>
                    Conversations and communities on Spectrum are public,
                    permalinked, and search engine optimized by default which
                    makes it easy for new members to find and join your
                    community.
                  </p>
                </FeatureCopy>
              </Feature>
              <Feature>
                <Icon glyph="profile" size="48" />
                <FeatureName>Every community, only one account</FeatureName>
                <FeatureCopy>
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
              <Happy />
            </Topic>
            <FeatureList>
              <Heading reverse>Keep your community happy and healthy.</Heading>
              <Feature>
                <Icon glyph="controls" size="48" />
                <FeatureName>
                  Granular controls for nuanced situations
                </FeatureName>
                <FeatureCopy>
                  <p>
                    We give you fine-grained solutions to moderation issues via
                    individual locking, blocking, and deletion controls for each
                    thread, message, and member in your community.
                  </p>
                  <p>
                    We also give every community automated toxicity monitoring
                    and spam prevention by default.
                  </p>
                </FeatureCopy>
              </Feature>
              <Feature>
                <Icon glyph="rep" size="48" />
                <FeatureName>Real members. Real reputation.</FeatureName>
                <FeatureCopy>
                  <p>
                    With Spectrum’s Rep system, you can see how active and
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
              <Impact />
            </Topic>
            <FeatureList>
              <Heading>Focus on impact, not usage.</Heading>
              <Feature>
                <Icon glyph="like" size="48" />
                <FeatureName>Understand your community’s health</FeatureName>
                <FeatureCopy>
                  <p>
                    When you add Community Analytics to your community, you’ll
                    get a bird’s eye view of your community’s overall growth and
                    user engagement.
                  </p>
                  <p>
                    You’ll also get a heads up of what types of conversations
                    are most active as well as a list of any that have gone
                    unanswered.
                  </p>
                </FeatureCopy>
              </Feature>
              <Feature>
                <Icon glyph="view" size="48" />
                <FeatureName comingSoon bright>
                  Connect the dots
                </FeatureName>
                <FeatureCopy>
                  <p>
                    With Spectrum integrations, your community can go beyond
                    engagement to provide a convenient first-touch experience to
                    organically onboard and convert new users.
                  </p>
                </FeatureCopy>
              </Feature>
              <Feature>
                <Icon glyph="analytics" size="48" />
                <FeatureName comingSoon bright>
                  Visualize your community’s ROI
                </FeatureName>
                <FeatureCopy>
                  <p>
                    With Business Analytics, you can connect your user accounts
                    to your community and correlate member activity directly to
                    key customer success metrics.
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
              <Ideas />
            </Topic>
            <FeatureList>
              <Heading reverse>
                Connect with your customers on a whole new level
              </Heading>
              <Feature>
                <Icon glyph="support" size="48" />
                <FeatureName>A support center with no off switch</FeatureName>
                <FeatureCopy>
                  <p>
                    1:1 support chat and ticket systems can make it hard to
                    provide help to users efficiently - especially at scale.
                  </p>
                  <p>
                    Spectrum enables you and your users to address issues
                    globally and searchably without the extra duplicated effort.
                  </p>
                </FeatureCopy>
              </Feature>
              <Feature>
                <Icon glyph="idea" size="48" />
                <FeatureName>Collect actionable feedback and ideas</FeatureName>
                <FeatureCopy>
                  <p>
                    Spectrum’s great for collecting feature requests and user
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
                <Icon glyph="friend" size="48" />
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
        <Section background={'default'} goop={4} color={'bg.reverse'}>
          <EtcGrid>
            <Heading>And there’s a whole lot more to love...</Heading>
            <EtcFeature color="success.alt">
              <Icon glyph="thread" />
              <EtcName>Unlimited chat</EtcName>
            </EtcFeature>
            <EtcFeature color="space.default">
              <Icon glyph="member-add" />
              <EtcName>Unlimited members</EtcName>
            </EtcFeature>
            <EtcFeature color="brand.alt">
              <Icon glyph="search" />
              <EtcName>Search-indexed threads</EtcName>
            </EtcFeature>
            <EtcFeature color="text.alt">
              <Icon glyph="welcome" />
              <EtcName>Brandable signup page</EtcName>
            </EtcFeature>
            <EtcFeature color="special.default">
              <Icon glyph="community" />
              <EtcName>Public community</EtcName>
            </EtcFeature>
            <EtcFeature color="warn.alt">
              <Icon glyph="private-outline" />
              <EtcName>Secure, private channels</EtcName>
            </EtcFeature>
            <EtcFeature color="special.alt">
              <Icon glyph="slack" />
              <EtcName>Slack bot + team import</EtcName>
            </EtcFeature>
            <EtcFeature color="success.default">
              <Icon glyph="email" />
              <EtcName>Email member invitations</EtcName>
            </EtcFeature>
            <EtcFeature color="brand.alt">
              <Icon glyph="home" />
              <EtcName>Unified Home feed</EtcName>
            </EtcFeature>
            <EtcFeature color="success.default">
              <Icon glyph="message" />
              <EtcName>Single DM inbox</EtcName>
            </EtcFeature>
            <EtcFeature color="space.default">
              <Icon glyph="notification" />
              <EtcName>Combined notification feed</EtcName>
            </EtcFeature>
            <EtcFeature color="warn.default">
              <Icon glyph="explore" />
              <EtcName>Curated Explore page</EtcName>
            </EtcFeature>
          </EtcGrid>
          <EtcCTA>
            <EtcName>What are you waiting for?</EtcName>
            <PrimaryButton to={'/new/community'}>Get started</PrimaryButton>
          </EtcCTA>
        </Section>
        <PageFooter />
      </Wrapper>
    );
  }
}
export default Features;
