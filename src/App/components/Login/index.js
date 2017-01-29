import React, { Component } from 'react';
import { login } from '../../../actions/user';
import { connect } from 'react-redux';
import { Input, LoginHeader, Logo } from './style';

class Login extends Component{
  constructor(){
    super();
    this.state = {
      email: "",
      password: ""
    };
  }

  updateEmail = (e) => {
    this.setState({ email: e.target.value });
  }

  updatePassword = (e) => {
    this.setState({ password: e.target.value });
  }

  login = (e) => {
    e.preventDefault();
    this.props.dispatch(login(this.state.email, this.state.password))
  }

	render() {
		return (
      <LoginHeader onSubmit={this.login} className="loginForm">
        <Logo src="/img/logo.png" alt="Spectrum Logo" />
        <Input type="email" onChange={this.updateEmail} value={this.state.email} placeholder="Email" />
        <Input type="password" onChange={this.updatePassword} value={this.state.password} placeholder="Password" />
        <button type="submit">Log In</button>
        
        { this.props.user.loginErr && 
          <div className="login-error">
            {this.props.user.loginError}
          </div>
        }
      </LoginHeader>
	  );
	}
}

const mapStateToProps = (state) => ({
  user: state.user,
  loginError: state.user.loginError
})

export default connect(mapStateToProps)(Login)

