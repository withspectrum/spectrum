// @flow
import React, { Component } from 'react';
//$FlowFixMe
import pure from 'recompose/pure';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import { connect } from 'react-redux';
import { TextButton } from '../../../../components/buttons';
import { ContinueButton } from '../../style';
import { toggleCommunityMembershipMutation } from '../../../../api/community';

class JoinFirstCommunityPure extends Component {
  save = e => {
    e.preventDefault();

    const {
      name,
      description,
      website,
      file,
      coverFile,
      photoSizeError,
    } = this.state;

    const input = {
      name,
      description,
      website,
      file,
      coverFile,
    };

    if (photoSizeError) {
      return;
    }

    this.setState({
      isLoading: true,
    });

    this.props
      .editUser(input)
      .then(({ data: { editUser } }) => {
        const user = editUser;

        this.setState({
          isLoading: false,
        });

        // the mutation returns a user object. if it exists,
        if (user !== undefined) {
          this.props.save();

          this.setState({
            file: null,
          });
        }
      })
      .catch(err => {
        this.setState({
          isLoading: false,
        });
      });
  };

  render() {
    const { community } = this.props;

    return <div>community!</div>;
  }
}

const map = state => ({
  currentUser: state.users.currentUser,
});

const JoinFirstCommunity = compose(
  toggleCommunityMembershipMutation,
  connect(map),
  pure
)(JoinFirstCommunityPure);
export default JoinFirstCommunity;
