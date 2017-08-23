// @flow
import React, { Component } from 'react';
import { track } from '../../helpers/events';
import Icon from '../../components/icons';
import { FlexCol, FlexRow } from '../../components/globals';
import { SERVER_URL } from '../../api';
import { storeItem, getItemFromStorage } from '../../helpers/localStorage';
import {
  SectionOne,
  SectionTwo,
  SectionThree,
  SectionFour,
  ClusterOne,
  ClusterTwo,
  ClusterThree,
  ClusterFour,
  GoopyOne,
  GoopyTwo,
  GoopyThree,
  GoopyFour,
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
  Footer,
  LinkBlock,
  LoginCard,
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
        <SectionOne>
          <SectionContent>
            <FlexCol>
              <LogoContainer>
                <LogoWhite />
              </LogoContainer>
              <Tagline>Build better communities.</Tagline>
              <Copy>
                Spectrum helps you create and grow your online community.
                Whether you’re an informal group or a massive company, Spectrum
                makes managing your community simple.
              </Copy>

              {/*

                  Primary call to action:
                  [Create a community] - should open an auth flow where user can sign in with fb/twitter/google

                  Secondary call to action could be to explore communities already being built on Spectrum

              */}
            </FlexCol>
          </SectionContent>
          <GoopyOne />
        </SectionOne>
        <SectionTwo>
          <ClusterOne src="/img/cluster-1.svg" role="presentation" />
          <ClusterTwo src="/img/cluster-2.svg" role="presentation" />
          <ClusterThree src="/img/cluster-5.svg" role="presentation" />
          <SectionContent>
            <FlexCol>
              <Tagline>Be where your people are.</Tagline>
              <Copy>
                On Spectrum, people can organically find your community through
                their favorite search engine, our curation and search tools, or
                other members of your community.
              </Copy>

              {/*

                  We could put community search here, primary CTA to view /explore
                  or just load in some featured community cards

                  We could do things like:
                  - manually insert a first "fake" search result saying something like "Your community here - create one now"
                  - also feels pretty powerful if someone were to search for themselves or search for a community they want to start, and probably find a null state, and we have a really compelling cta to create a communty from that search query

              */}
            </FlexCol>
          </SectionContent>
          <GoopyTwo />
        </SectionTwo>
        <SectionThree>
          <SectionContent>
            <FlexCol>
              <Tagline>Discussions without an expiration date</Tagline>
              <Copy>
                Conversations on Spectrum are public by default, and each one
                has its own link - making it easy for users to discover, share,
                or save them for later.
              </Copy>

              {/*

                  We could link to a thread here, or maybe link people to an example community
                  to see examples of how threads work?

              */}
            </FlexCol>
          </SectionContent>
          <GoopyThree />
        </SectionThree>
        <SectionTwo>
          <SectionContent>
            <ClusterOne src="/img/cluster-2.svg" role="presentation" />
            <ClusterTwo src="/img/cluster-1.svg" role="presentation" />
            <ClusterThree src="/img/cluster-5.svg" role="presentation" />
            <ClusterFour src="/img/cluster-4.svg" role="presentation" />
            <FlexCol>
              <Tagline>A better way to...</Tagline>
              <Bullets>
                <Bullet>
                  <BulletHeading>
                    <BulletTitle>Bring people together</BulletTitle>
                  </BulletHeading>
                  <BulletCopy>
                    Spectrum enables your top supporters and advocates to share
                    their knowledge, support other members, and foster a place
                    of belonging for everyone.
                  </BulletCopy>
                </Bullet>
                <Bullet>
                  <BulletHeading>
                    <BulletTitle>Supercharge customer support</BulletTitle>
                  </BulletHeading>
                  <BulletCopy>
                    Stop wasting time with a million private customer support
                    threads. Save your team from extra work by having
                    conversations with your community as a whole and chat
                    privately when a particular issue is sensitive.
                  </BulletCopy>
                </Bullet>
                <Bullet>
                  <BulletHeading>
                    <BulletTitle>Get better feedback</BulletTitle>
                  </BulletHeading>
                  <BulletCopy>
                    There's no better feedback than the insights that come
                    directly from your customers. Think of your community as a
                    new direct line to discovering what people want the most.
                  </BulletCopy>
                </Bullet>
              </Bullets>
            </FlexCol>
          </SectionContent>
          <GoopyFour />
        </SectionTwo>
        <SectionFour>
          <SectionContent>
            <ClusterOne src="/img/cluster-2.svg" role="presentation" />
            <ClusterTwo src="/img/cluster-1.svg" role="presentation" />
            <ClusterThree src="/img/cluster-5.svg" role="presentation" />
            <ClusterFour src="/img/cluster-4.svg" role="presentation" />
            <FlexCol>
              <Tagline>One team: your team.</Tagline>
              <Copy>
                On Spectrum, there's no switching between groups and scrambling
                to catch up with separate notifications and messages. Every
                conversation that matters comes directly to you.
              </Copy>
            </FlexCol>
          </SectionContent>
          <GoopyFour />
        </SectionFour>
        <Footer>
          <FlexRow>
            <a href="https://spectrum.chat/spectrum">
              <Icon glyph="logo" size={48} />
            </a>
          </FlexRow>
          <FlexRow smallCol center>
            <LinkBlock href="https://github.com/withspectrum/code-of-conduct">
              <div>Code of Conduct</div>
            </LinkBlock>
            <LinkBlock href="mailto:support@spectrum.chat">
              <div>Support</div>
            </LinkBlock>
            <LinkBlock href="mailto:hi@spectrum.chat">
              <div>Contact</div>
            </LinkBlock>
          </FlexRow>
        </Footer>
      </Wrapper>
    );
  }
}

export default Homepage;
