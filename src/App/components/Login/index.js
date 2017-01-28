import React, { Component } from 'react';
import { login } from '../../../actions/user';
import { connect } from 'react-redux'

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
      <form onSubmit={this.login} className="loginForm">
        <div>
          <input type="email" onChange={this.updateEmail} value={this.state.email} placeholder="Email" />
          <input type="password" onChange={this.updatePassword} value={this.state.password} placeholder="Password" />
        </div>
        <button type="submit" className="bg-brand color-light">Log In</button>
        
        { this.props.user.loginErr && 
          <div className="login-error">
            {this.props.user.loginError}
          </div>
        }
      </form>
	  );
	}
}

const mapStateToProps = (state) => ({
  user: state.user,
  loginError: state.user.loginError
})

export default connect(mapStateToProps)(Login)

