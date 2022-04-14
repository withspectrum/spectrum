// @flow
import * as React from 'react';
import slugg from 'slugg';
import { connect } from 'react-redux';
import { withApollo } from 'react-apollo';
import compose from 'recompose/compose';
import { Error, Success } from 'src/components/formElements';
import UsernameSearch from 'src/components/usernameSearch';
import { addToastWithTimeout } from 'src/actions/toasts';
import { Form, Row } from './style';
import editUserMutation from 'shared/graphql/mutations/user/editUser';
import { ContinueButton } from '../../style';
import type { Dispatch } from 'redux';

type Props = {
  client: Object,
  editUser: Function,
  save: Function,
  dispatch: Dispatch<Object>,
  user: ?Object,
};

type State = {
  username: string,
  error: string,
  success: string,
  isLoading: boolean,
};

class SetUsername extends React.Component<Props, State> {
  _isMounted = false;

  constructor(props) {
    super(props);
    const { user } = props;

    // try to intelligently suggest a starting username based on the
    // person's name, or firstname/lastname
    let username = user
      ? user.name
        ? slugg(user.name)
        : user.firstName && user.lastName
        ? `${user.firstName}-${user.lastName}`
        : ''
      : '';

    this.state = {
      username: username,
      error: '',
      success: '',
      isLoading: false,
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleUsernameValidation = ({ error, success, username }) => {
    this.setState({
      error,
      success,
      username,
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
        if (!this._isMounted) return;
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
        if (!this._isMounted) return;
        this.setState({
          isLoading: false,
          success: '',
        });
        this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const { username, isLoading, error, success } = this.state;

    return (
      <Form onSubmit={this.saveUsername}>
        <Row>
          <UsernameSearch
            placeholder={'Your username...'}
            autoFocus={true}
            username={username}
            onValidationResult={this.handleUsernameValidation}
            dataCy={'username-search'}
          />
        </Row>

        <Row style={{ minHeight: '43px' }}>
          {error && <Error data-cy="username-search-error">{error}</Error>}
          {success && (
            <Success data-cy="username-search-success">{success}</Success>
          )}
        </Row>

        <Row>
          <ContinueButton
            onClick={this.saveUsername}
            disabled={!username || error}
            loading={isLoading}
            data-cy="save-username-button"
          >
            {isLoading ? 'Saving...' : 'Save and Continue'}
          </ContinueButton>
        </Row>
      </Form>
    );
  }
}

export default compose(
  editUserMutation,
  withApollo,
  connect()
)(SetUsername);
