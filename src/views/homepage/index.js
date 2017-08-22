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
                Spectrum makes it easy to start and grow your online community.
                It was built from the ground up to help your community connect
                and start conversations that matter.
              </Copy>

              {/*

                  Primary call to action:
                  [Create a community] - should open an auth flow where user can sign in with fb/twitter/google

                  Secondary call to action could be to explore communities already being built on Spectrum

              */}
            </FlexCol>
            <img src="/img/login.svg" alt="Where communities are built." />
          </SectionContent>
          <GoopyOne />
        </SectionOne>
        <SectionTwo>
          <ClusterOne src="/img/cluster-1.svg" role="presentation" />
          <ClusterTwo src="/img/cluster-2.svg" role="presentation" />
          <ClusterThree src="/img/cluster-5.svg" role="presentation" />
          <SectionContent>
            <img
              src="/img/connect.svg"
              alt="All your favorite communities. Only one you."
            />
            <FlexCol>
              <Tagline>Be discovered</Tagline>

              <Copy>
                Whether your community is brand new, or just needs a little
                nudge, Spectrum is built to help your community be discovered.
              </Copy>
              <Copy>
                People can find your community on Spectrum when they search on
                Google, and we've built our own search and discovery features to
                make it easy for people to connect with your community inside
                the app.
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
              <Tagline>Your community, connected</Tagline>
              <Copy>
                On other apps, channels get jumbled, messages are lost, and that
                really great answer to your question from way-back-when is
                nowhere to be found.
              </Copy>
              <Copy>
                Spectrum keeps each conversation in its own unique and shareable
                place so that you can search for it whenever you're ready. There
                are no limits to how many conversations your community can
                create.
              </Copy>

              {/*

                  We could link to a thread here, or maybe link people to an example community
                  to see examples of how threads work?

              */}
            </FlexCol>
            <img src="/img/share.svg" alt="A better way to stay connected." />
          </SectionContent>
          <GoopyThree />
        </SectionThree>
        <SectionTwo>
          <SectionContent>
            <ClusterOne src="/img/cluster-2.svg" role="presentation" />
            <ClusterTwo src="/img/cluster-1.svg" role="presentation" />
            <ClusterThree src="/img/cluster-5.svg" role="presentation" />
            <ClusterFour src="/img/cluster-4.svg" role="presentation" />
            <Bullets>
              <Tagline>A better way to...</Tagline>
              <Bullet>
                <BulletHeading>
                  <Icon />
                  <BulletTitle>Bring people together</BulletTitle>
                </BulletHeading>
                <BulletCopy>
                  Help members help each other - Spectrum is a place where your
                  top supporters can help newcomers and foster a place of
                  belonging for everyone.
                </BulletCopy>
              </Bullet>
              <Bullet>
                <BulletHeading>
                  <Icon />
                  <BulletTitle>Supercharge customer support</BulletTitle>
                </BulletHeading>
                <BulletCopy>
                  On Spectrum it's easy to have conversations about issues or
                  bugs directly with your community.
                </BulletCopy>
                <BulletCopy>
                  These conversations are shareable and searchable, helping
                  anyone who has the same issue down the road resolve a problem
                  on their own.
                </BulletCopy>
              </Bullet>
              <Bullet>
                <BulletHeading>
                  <Icon />
                  <BulletTitle>Get better feedback</BulletTitle>
                </BulletHeading>
                <BulletCopy>
                  There's no better feedback than the insights that come
                  directly from your customers.
                </BulletCopy>
                <BulletCopy>
                  Spectrum makes it easy to get direct feedback from anyone in
                  your community - think of it as a new direct line to
                  discovering what people want the most.
                </BulletCopy>
              </Bullet>
            </Bullets>
          </SectionContent>
          <GoopyFour />
        </SectionTwo>
        <SectionThree>
          <SectionContent>
            <FlexCol>
              <Tagline>Bringing sanity to conversations</Tagline>
              <Copy>
                Every conversation on Spectrum is focused on a specific topic.
                Conversations can be shared, saved for later, or discovered at
                any point in time in search.
              </Copy>
              <Copy>
                We’ve scrapped the always-on, always-distracting real time chat
                feed and built conversations in a way that lets you join at your
                own pace.
              </Copy>
            </FlexCol>
            <img src="/img/share.svg" alt="A better way to stay connected." />
          </SectionContent>
          <GoopyThree />
        </SectionThree>
        <SectionFour>
          <SectionContent>
            <ClusterOne src="/img/cluster-2.svg" role="presentation" />
            <ClusterTwo src="/img/cluster-1.svg" role="presentation" />
            <ClusterThree src="/img/cluster-5.svg" role="presentation" />
            <ClusterFour src="/img/cluster-4.svg" role="presentation" />
            <img src="/img/create.svg" alt="Come on in, the chatter's fine." />
            <FlexCol>
              <Tagline>Your communities, one simple feed</Tagline>
              <Copy>
                Spectrum makes it easy to follow all of your communities in one
                simple feed. No more silos of notifications or direct messages,
                and no more login to remember for each community where you're a
                member.
              </Copy>
              <Copy>
                The Spectrum feed knows the conversations where you’re active,
                and resurfaces those conversations so that you never miss an
                important message.
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
