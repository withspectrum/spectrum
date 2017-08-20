// @flow
import React, { Component } from 'react';
// $FlowFixMe
import slugg from 'slugg';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import { withApollo } from 'react-apollo';
// $FlowFixMe
import compose from 'recompose/compose';
import { Error, Success } from '../../../../components/formElements';
import { Spinner } from '../../../../components/globals';
import { addToastWithTimeout } from '../../../../actions/toasts';
import { Form, Input, Loading, Row, InputLabel, InputSubLabel } from './style';
import { throttle } from '../../../../helpers/utils';
import {
  CHECK_UNIQUE_USERNAME_QUERY,
  editUserMutation,
} from '../../../../api/user';
import { ContinueButton } from '../../style';

class SetUsername extends Component {
  state: {
    username: string,
    error: string,
    success: string,
    isSearching: boolean,
    isLoading: boolean,
  };

  constructor(props) {
    super(props);
    const { user } = props;

    // try to intelligently suggest a starting username based on the
    // person's name, or firstname/lastname
    let username = user.name
      ? slugg(user.name)
      : user.firstName && user.lastName
        ? `${user.firstName}-${user.lastName}`
        : '';

    this.state = {
      username: username,
      error: '',
      success: '',
      isSearching: false,
      isLoading: false,
    };

    this.search = throttle(this.search, 500);
  }

  componentDidMount() {
    const { username } = this.state;
    // if no username was able to be suggested, don't kick off a search
    // with an empty string
    if (username.length === 0) return;
    this.search(username);
  }

  handleChange = e => {
    let username = e.target.value.trim();
    username = slugg(username);

    this.setState({
      error: '',
      success: '',
      username,
    });

    if (username.length > 20) {
      return this.setState({
        error: 'Usernames can be up to 20 characters',
      });
    } else if (username.length === 0) {
      return this.setState({
        error: 'Be sure to set a username so that people can find you!',
        success: '',
      });
    } else {
      this.setState({
        error: '',
      });
    }

    return this.search(username);
  };

  search = (username: string) => {
    if (username.length > 20) {
      return this.setState({
        error: 'Usernames can be up to 20 characters',
        success: '',
        isSearching: false,
      });
    } else if (username.length === 0) {
      return this.setState({
        error: "Your username can't be nothing...",
        success: '',
        isSearching: false,
      });
    } else {
      this.setState({
        error: '',
        isSearching: true,
      });

      // check the db to see if this channel slug exists
      this.props.client
        .query({
          query: CHECK_UNIQUE_USERNAME_QUERY,
          variables: {
            username,
          },
        })
        .then(({ data: { user } }) => {
          if (this.state.username.length > 20) {
            return this.setState({
              error: 'Usernames can be up to 20 characters because of reasons.',
              success: '',
              isSearching: false,
            });
          } else if (user && user.id) {
            return this.setState({
              error:
                'Someone already swooped this username – not feeling too original today, huh?',
              isSearching: false,
              success: '',
            });
          } else {
            return this.setState({
              error: '',
              isSearching: false,
              success: 'That username is available!',
            });
          }
        });
    }
  };

  saveUsername = e => {
    e.preventDefault();
    const { username } = this.state;

    this.setState({
      isLoading: true,
    });

    const input = {
      username,
    };

    this.props
      .editUser(input)
      .then(({ data: { editUser } }) => {
        this.setState({
          isLoading: false,
          success: '',
        });

        // trigger a method in the newUserOnboarding component class
        // to determine what to do next with this user - either push them
        // to community discovery or close the onboarding completely
        this.props.save();
      })
      .catch(err => {
        this.setState({
          isLoading: false,
          success: '',
        });
        this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const { username, isSearching, isLoading, error, success } = this.state;

    return (
      <Form onSubmit={this.saveUsername}>
        <InputLabel>Create your username</InputLabel>
        <InputSubLabel>You can change this later - no pressure!</InputSubLabel>

        <Row>
          <Input
            placeholder={'Set a username...'}
            defaultValue={username}
            onChange={this.handleChange}
            autoFocus={true}
          />

          {isSearching &&
            <Loading>
              <Spinner size={16} color={'brand.default'} />
            </Loading>}
        </Row>
        <Row>
          <Error>
            {error ? error : <span>&nbsp;</span>}
          </Error>

          <Success>
            {success ? success : <span>&nbsp;</span>}
          </Success>
        </Row>

        <Row>
          <ContinueButton
            onClick={this.saveUsername}
            disabled={!username || error}
            loading={isLoading}
          >
            Save and Continue
          </ContinueButton>
        </Row>
      </Form>
    );
  }
}

export default compose(editUserMutation, withApollo, connect())(SetUsername);
