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
import { Error, Success, UnderlineInput } from '../formElements';
import { Spinner } from '../globals';
import { Button } from '../buttons';
import { addToastWithTimeout } from '../../actions/toasts';
import { Form, Input, Loading, Row, Action } from './style';
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
    const { user, initialUsername } = props;
    let username;
    if (initialUsername) {
      username = initialUsername;
    } else {
      username = user.name ? slugg(user.name) : '';
    }

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
      this.props.isAvailable(null);
      return this.setState({
        error: 'Usernames can be up to 20 characters',
        success: '',
        isSearching: false,
      });
    } else if (username.length === 0) {
      this.props.isAvailable(null);
      return this.setState({
        error: "Your username can't be nothing...or can it?",
        success: '',
        isSearching: false,
      });
    } else {
      this.props.isAvailable(null);
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
            this.props.isAvailable(null);
            return this.setState({
              error: 'Usernames can be up to 20 characters because of reasons.',
              success: '',
              isSearching: false,
            });
          } else if (user && user.id) {
            this.props.isAvailable(null);
            return this.setState({
              error:
                'Someone already swooped this username – not feeling too original today, huh?',
              isSearching: false,
              success: '',
            });
          } else {
            this.props.isAvailable(username);
            return this.setState({
              error: '',
              isSearching: false,
              success: "Now that's one-of-a-kind!",
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
        this.props.save(user.username);
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
        </Row>
        <Row>
          <Error>
            {error ? error : <span>&nbsp;</span>}
          </Error>

          <Success>
            {success ? success : <span>&nbsp;</span>}
          </Success>
        </Row>
      </Form>
    );
  }
}

export default compose(editUserMutation, withApollo, connect())(SetUsername);
