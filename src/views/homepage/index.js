// @flow
import React, { Component } from 'react';
import compose from 'recompose/compose';
import { track } from '../../helpers/events';
import Column from '../../components/column';
import Icon from '../../components/icons';
import { Button } from '../../components/buttons';
import { Logo } from '../../components/logo';
import Search from '../explore/components/search';
import { FlexCol, FlexRow } from '../../components/globals';
import { SERVER_URL } from '../../api';
import { storeItem, getItemFromStorage } from '../../helpers/localStorage';
import Section from './components/section';
import { Conversation, Discover } from './components/illustrations';
import {
  Wrapper,
  Tagline,
  Copy,
  Bullets,
  Bullet,
  BulletHeading,
  BulletTitle,
  BulletCopy,
  LogoContainer,
  LogoWhite,
  SectionContent,
  LinkBlock,
  LoginCard,
  Footer,
  Flexer,
  PrimaryCTA,
  SecondaryCTA,
} from './style';

class Homepage extends Component {
  state: {
    preferredSigninMethod: string,
  };

  constructor() {
    super();

    const preferredSigninMethod = getItemFromStorage('preferred_signin_method');
    this.state = {
      preferredSigninMethod,
    };
  }

  componentDidMount() {
    track('homepage', 'viewed', null);
  }

  trackSignin = (type, method) => {
    track('homepage', 'logged in', type);
    storeItem('preferred_signin_method', method);
  };

  render() {
    const { preferredSigninMethod } = this.state;

    return (
      <Wrapper>
        <Section
          background="constellations"
          goop={2}
          style={{ padding: 0, flexDirection: 'column', marginTop: '0' }}
        >
          <FlexRow
            style={{
              width: '100%',
              justifyContent: 'space-between',
              position: 'relative',
              padding: '32px',
            }}
          >
            <Logo />
            <Button>Sign In</Button>
          </FlexRow>
          <FlexCol style={{ margin: '80px 40px 0' }}>
            <Tagline>Build better communities.</Tagline>
            <Copy>
              Spectrum helps you create and grow your online community in a
              healthy, scalable way.
            </Copy>
            <Copy>
              Whether you’re an informal group or a massive company, Spectrum
              makes managing your community simple.
            </Copy>
            <Flexer
              style={{ marginTop: '32px', justifyContent: 'space-between' }}
            >
              <PrimaryCTA icon="community">Create your community</PrimaryCTA>
              <SecondaryCTA icon="explore">Explore Spectrum</SecondaryCTA>
            </Flexer>

            {/*

                Primary call to action:
                [Create a community] - should open an auth flow where user can sign in with fb/twitter/google

                Secondary call to action could be to explore communities already being built on Spectrum

            */}
          </FlexCol>
        </Section>
        <Section goop={6} color={'space.light'}>
          <FlexCol>
            <Tagline>Be where your people are.</Tagline>
            <Copy>
              People shouldn't have to hunt down an email invite or search
              through a help center to find your community.
            </Copy>
            <Copy>
              When it's built on Spectrum, people can find your community
              organically through search, curation, or even other community
              members.
            </Copy>
            {/*

                We could put community search here, primary CTA to view /explore
                or just load in some featured community cards

                We could do things like:
                - manually insert a first "fake" search result saying something like "Your community here - create one now"
                - also feels pretty powerful if someone were to search for themselves or search for a community they want to start, and probably find a null state, and we have a really compelling cta to create a communty from that search query

            */}
          </FlexCol>
          <Discover />
        </Section>
        <Section
          goop={4}
          goopHeight={'60px'}
          background="bright"
          style={{ padding: '0', paddingTop: '40px', zIndex: '4' }}
        >
          <Column type="primary" style={{ margin: '0' }}>
            <Tagline>Find a community for you...</Tagline>
            <Search />
          </Column>
        </Section>
        <Section goop={7} color={'space.dark'}>
          <Conversation />
          <FlexCol>
            <Tagline>Real-time messaging; long-term value.</Tagline>
            <Copy>
              Conversations are chat-based just like your favorite messaging
              app, but on Spectrum they continue to provide value to more and
              more people over time.
            </Copy>
            <Copy>
              Every conversation gets a unique link to make it easy for users to
              discover, share, embed, or save conversations for later.
            </Copy>

            {/*

                We could link to a thread here, or maybe link people to an example community
                to see examples of how threads work?

            */}
          </FlexCol>
        </Section>
        <Section goop={2} background="dark">
          <FlexCol>
            <Tagline>Spectrum saves you time and money by...</Tagline>
            <Bullets>
              <Bullet>
                <BulletHeading>
                  <BulletTitle>Supercharging support</BulletTitle>
                </BulletHeading>
                <BulletCopy>
                  Stop wasting time with a million private customer support
                  threads about the same thing. Save your team from extra work
                  by having conversations with your community as a whole and
                  chat privately when a particular issue is sensitive.
                </BulletCopy>
              </Bullet>
              <Bullet>
                <BulletHeading>
                  <BulletTitle>Bringing people together</BulletTitle>
                </BulletHeading>
                <BulletCopy>
                  Spectrum enables your top supporters and advocates to share
                  their knowledge, support other members, and foster a place of
                  belonging for everyone.
                </BulletCopy>
              </Bullet>
              <Bullet>
                <BulletHeading>
                  <BulletTitle>Tightening your feedback loop</BulletTitle>
                </BulletHeading>
                <BulletCopy>
                  There's no better feedback than the insights that come
                  directly from your customers. Think of your Spectrum community
                  as a new direct line to discovering what people want the most.
                </BulletCopy>
              </Bullet>
            </Bullets>
          </FlexCol>
        </Section>
        <Section goop={1} color="bg.reverse">
          <FlexCol>
            <Tagline>One group: yours.</Tagline>
            <Copy>
              On other platforms, communities are separate so members end up
              constantly switching back and forth between groups to catch up
              with the latest messages.
            </Copy>
            <Copy>
              On Spectrum, the conversations that matter come to you - no matter
              which community they're in.
            </Copy>
          </FlexCol>
        </Section>
        <Footer background="light" goop={0}>
          <FlexRow>
            <a href="https://spectrum.chat/spectrum">
              <Icon glyph="logo" size={48} />
            </a>
          </FlexRow>
          <Flexer>
            <LinkBlock href="https://github.com/withspectrum/code-of-conduct">
              <div>Code of Conduct</div>
            </LinkBlock>
            <LinkBlock href="mailto:support@spectrum.chat">
              <div>Support</div>
            </LinkBlock>
            <LinkBlock href="mailto:hi@spectrum.chat">
              <div>Contact</div>
            </LinkBlock>
          </Flexer>
        </Footer>
      </Wrapper>
    );
  }
}
export default Homepage;
