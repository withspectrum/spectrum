import React from 'react';
import { connect } from 'react-redux';
import Icon from '../shared/Icons';
import { FlexCol } from '../shared/Globals';
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
  Wrapper,
  Tagline,
  Button,
  LogoContainer,
  LogoWhite,
  SectionContent,
  Copy,
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
            <img src="/img/login.svg" />
          </SectionContent>
          <GoopyOne />
        </SectionOne>
        <SectionTwo>
          <ClusterOne src="/img/cluster-1.svg" />
          <ClusterTwo src="/img/cluster-2.svg" />
          <ClusterThree src="/img/cluster-5.svg" />
          <SectionContent>
            <img src="/img/connect.svg" />
            <FlexCol>
              <Tagline>All your favorite communities. Only one you.</Tagline>

              <Copy>
                For years now, we've been hacking different messaging platforms to support large communities. We built something new to help you tap into the communities you care about all in one place.
              </Copy>
              <Copy>
                One feed. One account.
              </Copy>

            </FlexCol>
          </SectionContent>
          <GoopyTwo />
        </SectionTwo>
        <SectionThree>
          <SectionContent>
            <FlexCol>
              <Tagline>New things to love, no ads to hate.</Tagline>
              <Copy>
                Most social platforms build for growth above all else and then sell ads to monetize their users' content.
              </Copy>
              <Copy>
                We're dedicated to building a sustainable business that supports our users instead of selling them to advertisers.
              </Copy>
              <Copy>
                We know you're more than just your eyeballs.
              </Copy>
            </FlexCol>
            <img src="/img/share.svg" />
          </SectionContent>
          <GoopyThree />
        </SectionThree>
        <SectionFour>
          <SectionContent>
            <ClusterOne src="/img/cluster-2.svg" />
            <ClusterTwo src="/img/cluster-1.svg" />
            <ClusterThree src="/img/cluster-5.svg" />
            <ClusterFour src="/img/cluster-4.svg" />
            <img src="/img/create.svg" />
            <FlexCol>
              <Tagline>Come on in, the chatter's fine!</Tagline>

              <Copy>
                Conversations are impossible to keep up with on most platforms if you're not online all day.
              </Copy>
              <Copy>
                We're focused on making sure conversations are easy to join and follow whenever you're ready.
              </Copy>
              <Copy>
                So, hop on in!
              </Copy>
              <Button onClick={this.login}>
                <Icon icon="twitter" color="brand.default" static />
                {' '}
                <span>Sign in with Twitter</span>
              </Button>
            </FlexCol>
          </SectionContent>
        </SectionFour>
      </Wrapper>
    );
  }
}

export default connect()(Homepage);
