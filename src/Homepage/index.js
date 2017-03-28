import React from 'react';
import { connect } from 'react-redux';
import Icon from '../shared/Icons';
import { FlexCol } from '../shared/Globals';
import {
  SectionOne,
  SectionTwo,
  SectionThree,
  SectionFour,
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
  Img,
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
            <Img src="/img/login.svg" />
          </SectionContent>
          <GoopyOne />
        </SectionOne>
        <SectionTwo>
          <SectionContent>
            <FlexCol>
              <Tagline>All your favorite communities. Only one you.</Tagline>

              <Copy>
                For years now, we've been hacking different messaging platforms to support large communities. We built something new to help you tap into the communities you care about all in one place.
              </Copy>
              <Copy>
                One feed. One account.
              </Copy>

            </FlexCol>
            <Img src="/img/connect.svg" />
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
            <Img src="/img/share.svg" />
          </SectionContent>
          <GoopyThree />
        </SectionThree>
        <SectionFour>
          <SectionContent>
            <FlexCol>
              <Tagline>Something something, something else.</Tagline>

              <Copy>
                Who even cares? You all know this is just marketing copy. Basically, we want to make a great place for people to support each other.
              </Copy>
              <Copy>
                Scaling communities and conversations on other platforms is hard. We're working our asses off to make that better.
              </Copy>
              <Copy>
                But, we can't do it without you...
              </Copy>
            </FlexCol>
            <Img src="/img/create.svg" />
          </SectionContent>
        </SectionFour>
      </Wrapper>
    );
  }
}

export default connect()(Homepage);
