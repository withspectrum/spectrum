import React from 'react';
import { connect } from 'react-redux';
import { LoginButton } from '../App/components/StoryMaster/style';
import actions from '../actions';

class Homepage extends React.Component {
	login = e => {
    e.preventDefault();
    this.props.dispatch(actions.login());
  };

	render() {
		return (
			<div>
				<h1>Homepage</h1>
				<LoginButton onClick={this.login}>Sign in with Twitter</LoginButton>
			</div>
		)
	}
}

export default connect()(Homepage);
