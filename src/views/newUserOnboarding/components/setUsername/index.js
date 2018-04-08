// @flow
import * as React from 'react';
import slugg from 'slugg';
import { connect } from 'react-redux';
import { withApollo } from 'react-apollo';
import compose from 'recompose/compose';
import { Error, Success } from '../../../../components/formElements';
import { Spinner } from '../../../../components/globals';
import { addToastWithTimeout } from '../../../../actions/toasts';
import { Form, Input, Loading, Row, InputLabel, InputSubLabel } from './style';
import { debounce } from '../../../../helpers/utils';
import { getUserByUsernameQuery } from 'shared/graphql/queries/user/getUser';
import type { GetUserType } from 'shared/graphql/queries/user/getUser';
import editUserMutation from 'shared/graphql/mutations/user/editUser';
import { ContinueButton } from '../../style';

type Props = {
  client: Object,
  editUser: Function,
  save: Function,
  dispatch: Function,
  user: ?Object,
};

type State = {
  username: string,
  error: string,
  success: string,
  isSearching: boolean,
  isLoading: boolean,
};

class SetUsername extends React.Component<Props, State> {
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

    this.search = debounce(this.search, 500, false);
  }

  componentDidMount() {
    const { username } = this.state;
    // if no username was able to be suggested, don't kick off a search
    // with an empty string
    if (username.length === 0) return;

    // $FlowIssue
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

    if (!this.isUsernameValid(username)) {
      return this.changeStateBasedOnUsernameLength(username);
    }

    // $FlowIssue
    return this.search(username);
  };

  isUsernameValid = username => username.length > 0 && username.length <= 20;

  changeStateBasedOnUsernameLength = username => {
    if (username.length > 20) {
      this.setState({
        error: 'Usernames can be up to 20 characters',
        success: '',
        isSearching: false,
      });
    } else if (username.length === 0) {
      this.setState({
        error: 'Be sure to set a username so that people can find you!',
        success: '',
        isSearching: false,
      });
    } else {
      this.setState({
        error: '',
      });
    }
  };

  search = (username: string) => {
    // username in state could not be the same as username argument here
    // so dont make a call with previous username
    if (!this.isUsernameValid(this.state.username)) return;

    // username argument here is already validated
    this.setState({
      error: '',
      isSearching: true,
    });

    // check the db to see if this channel slug exists
    this.props.client
      .query({
        query: getUserByUsernameQuery,
        variables: {
          username,
        },
      })
      .then(({ data: { user } }: { data: { user: GetUserType } }) => {
        if (user && user.id) {
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
      })
      .catch(err => {
        console.error('Error looking up username: ', err);
      });
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
      .then(() => {
        this.setState({
          isLoading: false,
          success: '',
        });

        // trigger a method in the newUserOnboarding component class
        // to determine what to do next with this user - either push them
        // to community discovery or close the onboarding completely
        return this.props.save();
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

          {isSearching && (
            <Loading>
              <Spinner size={16} color={'brand.default'} />
            </Loading>
          )}
        </Row>
        <Row>
          <Error>{error ? error : <span>&nbsp;</span>}</Error>

          <Success>{success ? success : <span>&nbsp;</span>}</Success>
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
