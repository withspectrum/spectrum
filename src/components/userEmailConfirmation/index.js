// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { addToastWithTimeout } from 'src/actions/toasts';
import updateUserEmailMutation from 'shared/graphql/mutations/user/updateUserEmail';
import { Button } from 'src/components/button';
import { Input, Error } from '../formElements';
import isEmail from 'validator/lib/isEmail';
import { EmailForm } from './style';
import { Notice } from '../listItems/style';
import type { GetUserType } from 'shared/graphql/queries/user/getUser';
import type { Dispatch } from 'redux';

type Props = {
  render: Function,
  user: GetUserType,
  updateUserEmail: Function,
  dispatch: Dispatch<Object>,
};

type State = {
  isLoading: boolean,
  emailError: string,
  email: string,
};

class UserEmailConfirmation extends React.Component<Props, State> {
  initialState = {
    isLoading: false,
    emailError: '',
    email: '',
  };

  state = this.initialState;

  init = e => {
    e.preventDefault();
    if (!this.props.updateUserEmail) return;
    this.setState({ isLoading: true });
    return this.mutate();
  };

  mutate = () => {
    const { email } = this.state;

    if (!email || email.length === 0 || !isEmail(email)) {
      return this.setState({
        isLoading: false,
        emailError: 'Please enter a working email address',
      });
    }

    return this.props
      .updateUserEmail(email)
      .then(() => {
        this.props.dispatch(
          addToastWithTimeout('success', `Confirmation email sent to ${email}`)
        );
        return this.setState({
          isLoading: false,
          emailError: '',
        });
      })
      .catch(err => {
        this.props.dispatch(addToastWithTimeout('error', err.message));
        return this.setState({
          isLoading: false,
          emailError: err.message,
        });
      });
  };

  handleEmailChange = e => {
    this.setState({
      email: e.target.value,
      emailError: '',
    });
  };

  render() {
    const { emailError, email, isLoading } = this.state;
    const { user } = this.props;

    return (
      <React.Fragment>
        <EmailForm
          onSubmit={this.init}
          style={{ marginTop: '8px', marginBottom: '8px' }}
        >
          <Input
            type="email"
            defaultValue={email}
            onChange={this.handleEmailChange}
            placeholder={'Add your email address'}
          >
            Email Address
          </Input>

          <Button onClick={this.init} loading={isLoading}>
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </EmailForm>

        {user.pendingEmail && (
          <Notice>
            A confirmation link was sent to {user.pendingEmail}. Click the
            confirmation link and then return to this page. You can resend the
            confirmation here, or enter a new email address.
          </Notice>
        )}

        {emailError && <Error>{emailError}</Error>}
      </React.Fragment>
    );
  }
}

export default compose(
  updateUserEmailMutation,
  // $FlowIssue
  connect()
)(UserEmailConfirmation);
