import React from 'react';
import { connect } from 'react-redux';
import { Twitter } from '../shared/Icons';
import {
  Background,
  Tagline,
  Button,
  LogoContainer,
  LogoWhite,
  ContentWrapper,
  EmailInput,
  Submit,
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
      <Background>
        <ContentWrapper>
          <div>
            <LogoContainer><LogoWhite /></LogoContainer>
            <Tagline>
              Enter your email below to be the first to know when we launch the beta!
            </Tagline>
            {/*<Button onClick={this.login}>
              <Twitter color={'brand'} stayActive />
              {' '}
              <span>Sign in with Twitter</span>
            </Button>
            */
            }

            <div id="mc_embed_signup">
              <form
                action="//brianlovin.us3.list-manage.com/subscribe/post?u=bb74fc37bb01e808269590267&amp;id=2d579be9c8"
                method="post"
                id="mc-embedded-subscribe-form"
                name="mc-embedded-subscribe-form"
                className="validate"
                target="_blank"
                noValidate
              >
                <div id="mc_embed_signup_scroll">

                  <div className="mc-field-group">
                    <EmailInput
                      onChange={this.handleChange}
                      type="email"
                      placeholder="Your email address"
                      name="EMAIL"
                      className="required email"
                      id="mce-EMAIL"
                    />
                    <Submit
                      disabled={this.state.disabled}
                      type="submit"
                      value="Submit"
                      name="subscribe"
                      id="mc-embedded-subscribe"
                    />
                  </div>
                  <div style={{ position: 'absolute', left: '-5000px' }}>
                    <input
                      type="text"
                      name="b_bb74fc37bb01e808269590267_171da5009e"
                      tabIndex="-1"
                      value=""
                    />
                  </div>
                </div>
                <div
                  className="response"
                  id="mce-error-response"
                  style={{ display: 'none' }}
                />
                <div
                  className="response"
                  id="mce-success-response"
                  style={{ display: 'none' }}
                />
              </form>
            </div>
          </div>
          <Img src="/img/login.svg" />
        </ContentWrapper>
      </Background>
    );
  }
}

export default connect()(Homepage);
