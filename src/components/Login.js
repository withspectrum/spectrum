import React, { Component } from 'react';
import * as firebase from 'firebase';

class Login extends Component{
  constructor(props){
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }
  updateEmail(e){
    this.setState({ email: e.target.value });
  }
  updatePassword(e){
    this.setState({ password: e.target.value });
  }
  loginAction(){
    var that = this;
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(function(res){
      console.log(res);
    }, function(err){
      that.setState({error: true, errorMessage: err.message});
    });
  }
	render() {
    var that = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (!that.props.currentUser){
        that.props.setUser(user);
      }
    });
		return (
      <form onSubmit={this.loginAction} className="loginForm">
        <div>
          <input type="email" onChange={this.updateEmail.bind(this)} value={this.state.email} placeholder="Email" />
          <input type="password" onChange={this.updatePassword.bind(this)} value={this.state.password} placeholder="Password" />
        </div>
        <button type="submit" className="bg-brand color-light">Log In</button>
        {that.state.error &&
          <div className="login-error">
            {that.state.errorMessage}
          </div>
        }
      </form>
	  );
	}
}

export default Login;
