import React from 'react';
import { connect } from 'react-redux';
import Icon from '../shared/Icons';
import {
  Tagline,
  Button,
  LogoContainer,
  LogoWhite,
  SectionOne,
  SectionOneWrapper,
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
      <SectionOne>
        <SectionOneWrapper>
          <div>
            <LogoContainer><LogoWhite /></LogoContainer>
            <Tagline>Where communities are built.</Tagline>

            <Button onClick={this.login}>
              <Icon icon="twitter" reverse static />
              {' '}
              <span>Sign in with Twitter</span>
            </Button>
          </div>
          <Img src="/img/login.svg" />
        </SectionOneWrapper>
      </SectionOne>
    );
  }
}

export default connect()(Homepage);
