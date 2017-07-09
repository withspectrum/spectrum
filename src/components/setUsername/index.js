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
import { Input, Error, Success, UnderlineInput } from '../formElements';
import { Spinner } from '../globals';
import { Button } from '../buttons';
import { addToastWithTimeout } from '../../actions/toasts';
import { Form, Loading, Row, Action } from './style';
import { throttle } from '../../helpers/utils';
import { CHECK_UNIQUE_USERNAME_QUERY, editUserMutation } from '../../api/user';

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
    const username = user.name ? slugg(user.name) : '';

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
    // if no username
    if (!username.length > 0) return;
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
      this.setState({
        error: 'Usernames can be up to 20 characters',
      });

      return;
    } else if (username.length === 0) {
      this.setState({
        error: 'Be sure to set a username so that people can find you!',
        success: '',
      });
    } else {
      this.setState({
        error: '',
      });
    }

    this.search(username);
  };

  search = username => {
    if (username.length > 20) {
      return this.setState({
        error: 'Usernames can be up to 20 characters',
        success: '',
        isSearching: false,
      });
    } else if (username.length === 0) {
      return this.setState({
        error: 'Be sure to set a username so that people can find you!',
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
        .then(({ data, data: { user } }) => {
          if (this.state.username.length > 20) {
            return this.setState({
              error: 'Usernames can be up to 20 characters',
              success: '',
              isSearching: false,
            });
          } else if (user && user.id) {
            return this.setState({
              error: 'This username is already taken, sorry!',
              isSearching: false,
              success: '',
            });
          } else {
            return this.setState({
              error: '',
              isSearching: false,
              success: 'This username is available! Save it to continue...',
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
      .then(({ data: { user } }) => {
        this.setState({
          isLoading: false,
          success: '',
        });
        this.props.usernameSaved();
        this.props.dispatch(addToastWithTimeout('success', 'Username saved!'));
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

          <Action>
            <Button
              disabled={error || username.length > 20}
              loading={isLoading}
              onClick={this.saveUsername}
            >
              Save
            </Button>
          </Action>
        </Row>
        <Row>
          <UnderlineInput disabled defaultValue={username}>
            spectrum.chat/users/
          </UnderlineInput>
        </Row>
        <Row>
          {error &&
            <Error>
              {error}
            </Error>}

          {success &&
            <Success>
              {success}
            </Success>}
        </Row>
      </Form>
    );
  }
}

export default compose(editUserMutation, withApollo, connect())(SetUsername);
