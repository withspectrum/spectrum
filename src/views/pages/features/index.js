// @flow
import * as React from 'react';
import { track } from 'src/helpers/events';
import Section from 'src/components/themedSection';
import PageFooter from '../components/footer';
import { Wrapper } from '../style';
import { Content, Heading, Subhead, Copy } from '../pricing/style';
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
        <Section background={'illustrated'} goop={1} color={'brand.alt'}>
          <Content>
            <Heading>
              Everything you need to build a great online community.
            </Heading>
            <Copy>
              Our whole platform was built from the ground up to make building
              an online community simple.
            </Copy>
            <Copy>
              Spectrum makes it easy to grow your community organically,
              moderate efficiently to keep conversations safe and constructive,
              and measure your community's value to your organization.
            </Copy>
          </Content>
        </Section>
        <Section background={'brand'} goop={3} color={'space.alt'}>
          <Content>
            <Heading reverse>
              Growing a community has never been so easy.
            </Heading>
            <Copy reverse>
              Every community is public by default and customizable to suit your
              brand. Once your community is up and running, it can easily be
              linked to from your website or discovered organically.
            </Copy>
            <Subhead reverse>Need to lock something down?</Subhead>
            <Copy reverse>
              You can also quickly spin up private, invite-only channels for
              sensitive conversations that need to be kept secure.
            </Copy>
          </Content>
        </Section>
        <Section background={'bright'} goop={2} color={'bg.default'}>
          <Content>
            <Heading reverse>
              Realtime conversations with longterm value.
            </Heading>
            <Copy reverse>
              Chat is becoming the de facto standard for online communities for
              good reason. Static forums often feel dead and static, while
              communities need to feel alive and vibrant to flourish.
            </Copy>
            <Copy reverse>
              On Spectrum, every conversation is realtime chat organized into
              focused, topical threads. Each thread is search indexed and
              linkable making them easy to save for later, share on social
              media, or discover via search.
            </Copy>
          </Content>
        </Section>
        <Section goop={6} color={'bg.reverse'}>
          <Content>
            <Heading>Measure your community's impact.</Heading>
            <Copy>
              Communities are notoriously difficult to measure impact. Everyone
              knows that having a community is useful, but it's hard to prove
              their exact value to your company.
            </Copy>
            <Copy>
              We're building community analytics to help track down how your
              community is helping your business from support and product
              feedback to conversion and customer success.
            </Copy>
          </Content>
        </Section>
        <Section background={'reverse'} goop={5} color={'bg.default'}>
          <Content>
            <Heading reverse>One account. Every community.</Heading>
            <Copy reverse>
              No one enjoys having dozens of accounts for different communities
              and forums. Setting the same preferences over and over, playing
              whack-a-mole with notifications, and keeping track of where you
              direct messaged someone shouldn't be required to get involved.
            </Copy>
            <Copy reverse>
              On Spectrum, everyone gets a single account with a single profile,
              a single set of preferences, a single DM inbox, and a home feed
              that brings all your communities to you.
            </Copy>
            <Copy reverse>
              You can easily tweak your notifications at a global level or
              individually follow or unfollow conversations and channels.
            </Copy>
          </Content>
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
