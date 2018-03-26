// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import type { GetCommunitySettingsType } from 'shared/graphql/queries/community/getCommunitySettings';
import { isEmail } from 'validator';
import { addToastWithTimeout } from '../../../actions/toasts';
import { Input, Error } from '../../../components/formElements';
import { Notice } from '../../../components/listItems/style';
import { Button } from '../../../components/buttons';
import updateAdministratorEmailMutation from 'shared/graphql/mutations/community/updateAdministratorEmail';
import { EmailForm } from '../style';
import {
  SectionCard,
  SectionTitle,
  SectionSubtitle,
} from '../../../components/settingsViews/style';

type Props = {
  id: string,
  dispatch: Function,
  community: GetCommunitySettingsType,
  updateAdministratorEmail: Function,
};

type State = {
  isLoading: boolean,
  emailError: string,
  email: string,
};

class AdministratorEmailForm extends React.Component<Props, State> {
  initialState = {
    isLoading: false,
    emailError: '',
    email: '',
  };

  state = this.initialState;

  init = e => {
    e.preventDefault();
    if (!this.props.updateAdministratorEmail) return;
    this.setState({ isLoading: true });
    return this.mutate();
  };

  mutate = () => {
    const { community } = this.props;
    const { email } = this.state;

    if (!email || email.length === 0 || !isEmail(email)) {
      return this.setState({
        isLoading: false,
        emailError: 'Please enter a working email address',
      });
    }

    const input = {
      id: community.id,
      email,
    };

    return this.props
      .updateAdministratorEmail({ input })
      .then(data => {
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
    const { community } = this.props;

    return (
      <SectionCard>
        <SectionTitle>Admin Email Address</SectionTitle>
        <SectionSubtitle>
          An administrator email address is required for this community. All
          billing notifications including receipts will go to this address. This
          email can be different from your personal email address.
        </SectionSubtitle>
        <EmailForm
          onSubmit={this.init}
          style={{ marginTop: '8px', marginBottom: '8px' }}
        >
          <Input
            type="email"
            defaultValue={email}
            onChange={this.handleEmailChange}
            placeholder={'Add your email address'}
            inputType={'email'}
          >
            Email Address
          </Input>

          <Button
            type="submit"
            onClick={this.init}
            loading={isLoading}
            dataCy="administrator-email-submit"
          >
            Submit
          </Button>
        </EmailForm>

        {community.billingSettings.pendingAdministratorEmail && (
          <Notice data-cy="administrator-email-form-pending-sent">
            A confirmation link was sent to{' '}
            {community.billingSettings.pendingAdministratorEmail}. Click the
            confirmation link and then return to this page. You can resend the
            confirmation here, or enter a new email address.
          </Notice>
        )}

        {emailError && (
          <Error dataCy="administrator-email-form-error">{emailError}</Error>
        )}
      </SectionCard>
    );
  }
}

export default compose(connect(), updateAdministratorEmailMutation)(
  AdministratorEmailForm
);
