// @flow
import React, { Component } from 'react';
import { track } from '../../helpers/events';
import Icon from '../../components/icons';
import { FlexCol, FlexRow } from '../../components/globals';
import { SERVER_URL } from '../../api';
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
  Button,
  LinkButton,
  LogoContainer,
  LogoWhite,
  SectionContent,
  Copy,
  Footer,
  LinkBlock,
} from './style';

class Homepage extends Component {
  componentDidMount() {
    track('homepage', 'viewed', null);
  }

  trackSignin = type => {
    track('homepage', 'logged in', type);
  };

  render() {
    return (
      <Wrapper>
        <SectionOne>
          <SectionContent>
            <FlexCol>
              <LogoContainer><LogoWhite /></LogoContainer>
              <Tagline>Where communities are built.</Tagline>
              <Button
                href={`${SERVER_URL}/auth/twitter`}
                onClick={() => this.trackSignin('primary cta')}
              >
                <Icon glyph="twitter" />
                {' '}
                <span>Sign in with Twitter</span>
              </Button>

              <Button
                href={`${SERVER_URL}/auth/facebook`}
                onClick={() => this.trackSignin('primary cta')}
              >
                <Icon glyph="facebook" />
                {' '}
                <span>Sign in with Facebook</span>
              </Button>

              <Button
                href={`${SERVER_URL}/auth/google`}
                onClick={() => this.trackSignin('primary cta')}
              >
                <span>Sign in with Google</span>
              </Button>

              <Button
                href={`${SERVER_URL}/auth/github`}
                onClick={() => this.trackSignin('primary cta')}
              >
                <span>Sign in with GitHub</span>
              </Button>
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
              <Tagline>All your favorite communities. Only one you.</Tagline>

              <Copy>
                For years people have been hacking different messaging platforms to support growing online communities.
              </Copy>
              <Copy>
                Spectrum was built from the ground up to keep you connected with the communities you care about in one simple feed.
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
                In most apps, channels get jumbled, messages are lost, and that really great answer to your question from way-back-when is nowhere to be found.
              </Copy>
              <Copy>
                Spectrum keeps each conversation in its own unique and shareable place so that you can find it whenever you're ready.
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
              <Tagline>Come on in, the chatter's fine.</Tagline>
              <Copy>
                Spectrum is free for everyone, so dive on in!
              </Copy>
              <LinkButton
                href={`${SERVER_URL}/auth/twitter`}
                onClick={() => this.trackSignin('secondary cta')}
              >
                <Icon glyph="twitter" />
                {' '}
                <span>Sign in with Twitter</span>
              </LinkButton>
            </FlexCol>
          </SectionContent>
          <GoopyFour />
        </SectionFour>
        <Footer>
          <FlexRow>
            <a href="https://spectrum.chat/spectrum/~general">
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
