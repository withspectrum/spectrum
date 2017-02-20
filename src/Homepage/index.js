import React from 'react';
import { connect } from 'react-redux';
import { LoginButton } from '../App/components/StoryMaster/style';
import { login } from '../actions/user';

class Homepage extends React.Component {
  login = e => {
    e.preventDefault();
    this.props.dispatch(login());
  };

  render() {
    return (
      <div>
        <h1>Homepage</h1>
        <LoginButton onClick={this.login}>Sign in with Twitter</LoginButton>
      </div>
    );
  }
}

export default connect()(Homepage);
