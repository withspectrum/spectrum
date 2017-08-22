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
                Spectrum makes it easy to find your people and create the
                conversations that matter.
              </Copy>
              <Copy>
                {' '}It’s built from the ground up to enable healthy, scalable
                online communities.
              </Copy>
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
              <Tagline>A new way to grow</Tagline>

              <Copy>
                When communities live together in one place, it becomes easier
                for the right people to be a part of the right conversations.
                Spectrum makes it easy for people to find your community through
                sharing, search, and curation.
              </Copy>
              <Copy>
                Already run an existing community, and need a new home with the
                right set of tools to do your job? We’ve built easy migration
                tools to quickly invite your entire Slack team or Facebook Group
                to your new community on Spectrum.
              </Copy>
            </FlexCol>
          </SectionContent>
          <GoopyTwo />
        </SectionTwo>
        <SectionThree>
          <SectionContent>
            <FlexCol>
              <Tagline>A better way to stay connected.</Tagline>
              <Copy>
                In most apps, channels get jumbled, messages are lost, and that
                really great answer to your question from way-back-when is
                nowhere to be found.
              </Copy>
              <Copy>
                Spectrum keeps each conversation in its own unique and shareable
                place so that you can find it whenever you're ready.
              </Copy>
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
              <Tagline>Better conversations.</Tagline>
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
                and resurfaces those threads so that you never miss an important
                message.
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
