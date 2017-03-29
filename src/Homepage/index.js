import React from 'react';
import { connect } from 'react-redux';
import Icon from '../shared/Icons';
import { FlexCol, FlexRow } from '../shared/Globals';
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
  LogoContainer,
  LogoWhite,
  SectionContent,
  Copy,
  Footer,
  LinkBlock,
} from './style';
import { login } from '../actions/user';

class Homepage extends React.Component {
  constructor() {
    super();

    this.state = {
      disabled: true,
    };
  }

  handleChange = e => {
    if (!e.target.value) {
      this.setState({
        disabled: true,
      });
      return;
    }

    if (e.target.value.toLowerCase() === 'abracadabra let me in') this.login(e);

    this.setState({
      disabled: false,
    });
  };

  login = e => {
    e.preventDefault();
    this.props.dispatch(login());
  };

  render() {
    return (
      <Wrapper>
        <SectionOne>
          <SectionContent>
            <FlexCol>
              <LogoContainer><LogoWhite /></LogoContainer>
              <Tagline>Where communities are built.</Tagline>
              <Button onClick={this.login}>
                <Icon icon="twitter" reverse static />
                {' '}
                <span>Sign in with Twitter</span>
              </Button>
            </FlexCol>
            <img src="/img/login.svg" role="presentation" />
          </SectionContent>
          <GoopyOne />
        </SectionOne>
        <SectionTwo>
          <ClusterOne src="/img/cluster-1.svg" role="presentation" />
          <ClusterTwo src="/img/cluster-2.svg" role="presentation" />
          <ClusterThree src="/img/cluster-5.svg" role="presentation" />
          <SectionContent>
            <img src="/img/connect.svg" role="presentation" />
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
            <img src="/img/share.svg" role="presentation" />
          </SectionContent>
          <GoopyThree />
        </SectionThree>
        <SectionFour>
          <SectionContent>
            <ClusterOne src="/img/cluster-2.svg" role="presentation" />
            <ClusterTwo src="/img/cluster-1.svg" role="presentation" />
            <ClusterThree src="/img/cluster-5.svg" role="presentation" />
            <ClusterFour src="/img/cluster-4.svg" role="presentation" />
            <img src="/img/create.svg" role="presentation" />
            <FlexCol>
              <Tagline>Come on in, the chatter's fine.</Tagline>
              <Copy>
                Spectrum is free for everyone, so hop on in!
              </Copy>
              <Button onClick={this.login}>
                <Icon icon="twitter" color="brand.default" static />
                {' '}
                <span>Sign in with Twitter</span>
              </Button>
            </FlexCol>
          </SectionContent>
          <GoopyFour />
        </SectionFour>
        <Footer>
          <FlexRow>
            <a href="https://spectrum.chat/~spectrum">
              <Icon icon="logo" reverse size={48} />
            </a>
          </FlexRow>
          <FlexRow smallCol center>
            <LinkBlock href="">
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

export default connect()(Homepage);
