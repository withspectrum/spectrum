// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import {
  getCommunityById,
  type GetCommunityType,
} from 'shared/graphql/queries/community/getCommunity';
import { Loading } from 'src/components/loading';
import viewNetworkHandler, {
  type ViewNetworkHandlerType,
} from 'src/components/viewNetworkHandler';
import {
  SectionCard,
  SectionTitle,
  SectionSubtitle,
  SectionCardFooter,
} from 'src/components/settingsViews/style';
import BrandedLoginToggle from './brandedLoginToggle';
import { TextButton, OutlineButton } from 'src/components/button';
import { TextArea, Error } from 'src/components/formElements';
import saveBrandedLoginSettings from 'shared/graphql/mutations/community/saveBrandedLoginSettings';
import { addToastWithTimeout } from 'src/actions/toasts';
import type { Dispatch } from 'redux';

type Props = {
  data: {
    community: GetCommunityType,
  },
  ...$Exact<ViewNetworkHandlerType>,
  saveBrandedLoginSettings: Function,
  dispatch: Dispatch<Object>,
};

type State = {
  messageValue: ?string,
  messageLengthError: boolean,
  isLoading: boolean,
};

class BrandedLogin extends React.Component<Props, State> {
  state = {
    messageValue: null,
    messageLengthError: false,
    isLoading: false,
  };

  componentDidUpdate(prevProps) {
    const curr = this.props;
    if (!prevProps.data.community && curr.data.community) {
      return this.setState({
        messageValue: curr.data.community.brandedLogin.message,
      });
    }
  }

  handleChange = e => {
    return this.setState({
      messageValue: e.target.value,
      messageLengthError: e.target.value.length > 280 ? true : false,
    });
  };

  saveCustomMessage = e => {
    e.preventDefault();
    const { messageValue } = this.state;

    if (messageValue && messageValue.length > 280) {
      return this.setState({
        messageLengthError: true,
      });
    }

    this.setState({
      isLoading: true,
    });

    return this.props
      .saveBrandedLoginSettings({
        message: messageValue,
        id: this.props.data.community.id,
      })
      .then(() => {
        this.setState({ messageLengthError: false, isLoading: false });
        return this.props.dispatch(addToastWithTimeout('success', 'Saved!'));
      })
      .catch(err => {
        this.setState({ messageLengthError: false, isLoading: false });
        return this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const {
      data: { community },
      isLoading,
    } = this.props;
    const { messageLengthError } = this.state;

    if (community) {
      const { brandedLogin } = community;
      return (
        <SectionCard data-cy="community-settings-branded-login">
          <SectionTitle>Branded Login</SectionTitle>
          <SectionSubtitle>
            Display a custom login message when people are signing up to
            Spectrum directly from your community’s profile
          </SectionSubtitle>

          <BrandedLoginToggle settings={brandedLogin} id={community.id} />

          <form onSubmit={this.saveCustomMessage}>
            {brandedLogin.isEnabled && (
              <TextArea
                defaultValue={brandedLogin.message}
                placeholder={'Set a custom message for the login screen'}
                onChange={this.handleChange}
                dataCy="community-settings-branded-login-input"
              />
            )}

            {messageLengthError && (
              <Error>
                Custom login messages should be under 280 characters.
              </Error>
            )}

            {brandedLogin.isEnabled && (
              <SectionCardFooter
                style={{
                  flexDirection: 'row-reverse',
                  justifyContent: 'flex-start',
                }}
              >
                <OutlineButton
                  style={{ alignSelf: 'flex-start', marginLeft: '8px' }}
                  onSubmit={this.saveCustomMessage}
                  onClick={this.saveCustomMessage}
                  disabled={messageLengthError}
                  loading={this.state.isLoading}
                  data-cy="community-settings-branded-login-save"
                >
                  {this.state.isLoading ? 'Saving...' : 'Save'}
                </OutlineButton>

                <TextButton
                  to={`/${community.slug}/login`}
                  style={{ alignSelf: 'flex-start', marginRight: '8px' }}
                  data-cy="community-settings-branded-login-preview"
                >
                  Preview
                </TextButton>
              </SectionCardFooter>
            )}
          </form>
        </SectionCard>
      );
    }

    if (isLoading) {
      return (
        <SectionCard>
          <Loading />
        </SectionCard>
      );
    }

    return null;
  }
}

export default compose(
  getCommunityById,
  viewNetworkHandler,
  saveBrandedLoginSettings,
  connect()
)(BrandedLogin);
