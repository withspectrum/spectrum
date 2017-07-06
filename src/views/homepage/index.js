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
  Button,
  ButtonTwitter,
  ButtonFacebook,
  ButtonGoogle,
  LinkButton,
  LogoContainer,
  LogoWhite,
  SectionContent,
  Copy,
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
              <LogoContainer><LogoWhite /></LogoContainer>
              <Tagline>Where communities are built.</Tagline>
              <LoginCard>
                <ButtonTwitter
                  preferred={
                    preferredSigninMethod === 'twitter' ||
                      !preferredSigninMethod
                  }
                  after={preferredSigninMethod === 'twitter'}
                  href={`${SERVER_URL}/auth/twitter`}
                  onClick={() => this.trackSignin('primary cta', 'twitter')}
                >
                  <Icon glyph="twitter" />
                  {' '}
                  <span>Sign in with Twitter</span>
                </ButtonTwitter>

                <ButtonFacebook
                  preferred={
                    preferredSigninMethod === 'facebook' ||
                      !preferredSigninMethod
                  }
                  after={preferredSigninMethod === 'facebook'}
                  href={`${SERVER_URL}/auth/facebook`}
                  onClick={() => this.trackSignin('primary cta', 'facebook')}
                >
                  <Icon glyph="facebook" />
                  {' '}
                  <span>Sign in with Facebook</span>
                </ButtonFacebook>

                <ButtonGoogle
                  preferred={
                    preferredSigninMethod === 'google' || !preferredSigninMethod
                  }
                  after={preferredSigninMethod === 'google'}
                  href={`${SERVER_URL}/auth/google`}
                  onClick={() => this.trackSignin('primary cta', 'google')}
                >
                  <Icon glyph="google" />
                  {' '}
                  <span>Sign in with Google</span>
                </ButtonGoogle>
              </LoginCard>
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
              <LoginCard noShadow>
                {preferredSigninMethod &&
                  <span>
                    <ButtonTwitter
                      preferred={preferredSigninMethod === 'twitter'}
                      after={preferredSigninMethod === 'twitter'}
                      whitebg={preferredSigninMethod !== 'twitter'}
                      href={`${SERVER_URL}/auth/twitter`}
                      onClick={() =>
                        this.trackSignin('secondary cta', 'twitter')}
                    >
                      <Icon glyph="twitter" />
                      {' '}
                      <span>Sign in with Twitter</span>
                    </ButtonTwitter>

                    <ButtonFacebook
                      preferred={preferredSigninMethod === 'facebook'}
                      after={preferredSigninMethod === 'facebook'}
                      whitebg={preferredSigninMethod !== 'facebook'}
                      href={`${SERVER_URL}/auth/facebook`}
                      onClick={() =>
                        this.trackSignin('secondary cta', 'facebook')}
                    >
                      <Icon glyph="facebook" />
                      {' '}
                      <span>Sign in with Facebook</span>
                    </ButtonFacebook>

                    <ButtonGoogle
                      preferred={preferredSigninMethod === 'google'}
                      after={preferredSigninMethod === 'google'}
                      whitebg={preferredSigninMethod !== 'google'}
                      href={`${SERVER_URL}/auth/google`}
                      onClick={() =>
                        this.trackSignin('secondary cta', 'google')}
                    >
                      <Icon glyph="google" />
                      {' '}
                      <span>Sign in with Google</span>
                    </ButtonGoogle>
                  </span>}

                {!preferredSigninMethod &&
                  <span>
                    <ButtonTwitter
                      preferred
                      href={`${SERVER_URL}/auth/twitter`}
                      after={preferredSigninMethod === 'twitter'}
                      onClick={() =>
                        this.trackSignin('secondary cta', 'twitter')}
                    >
                      <Icon glyph="twitter" />
                      {' '}
                      <span>Sign in with Twitter</span>
                    </ButtonTwitter>

                    <ButtonFacebook
                      preferred
                      href={`${SERVER_URL}/auth/facebook`}
                      after={preferredSigninMethod === 'facebook'}
                      onClick={() =>
                        this.trackSignin('secondary cta', 'facebook')}
                    >
                      <Icon glyph="facebook" />
                      {' '}
                      <span>Sign in with Facebook</span>
                    </ButtonFacebook>

                    <ButtonGoogle
                      preferred
                      href={`${SERVER_URL}/auth/google`}
                      after={preferredSigninMethod === 'google'}
                      onClick={() =>
                        this.trackSignin('secondary cta', 'google')}
                    >
                      <Icon glyph="google" />
                      {' '}
                      <span>Sign in with Google</span>
                    </ButtonGoogle>
                  </span>}
              </LoginCard>
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
