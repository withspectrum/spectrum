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
  login(){
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
        that.props.setCurrentUser(user);
      }
    });
		return (
      <div>
        <input type="email" onChange={this.updateEmail.bind(this)} value={this.state.email} />
        <input type="password" onChange={this.updatePassword.bind(this)} value={this.state.password} />
        <button onClick={this.login.bind(this)}>Log In</button>
        {that.state.error &&
          <div>
            {that.state.errorMessage}
          </div>
        }
      </div>
	  );
	}
}

export default Login;
