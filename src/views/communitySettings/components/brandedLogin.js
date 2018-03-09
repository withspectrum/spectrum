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
import Link from 'src/components/link';
import { Button, OutlineButton } from 'src/components/buttons';
import { Input } from 'src/components/formElements';
import saveBrandedLoginCustomMessage from 'shared/graphql/mutations/community/saveBrandedLoginCustomMessage';
import { addToastWithTimeout } from '../../../actions/toasts';

type Props = {
  data: {
    community: GetCommunityType,
  },
  ...$Exact<ViewNetworkHandlerType>,
  saveBrandedLoginCustomMessage: Function,
  dispatch: Function,
};

type State = {
  customMessageValue: ?string,
};

class BrandedLogin extends React.Component<Props, State> {
  state = { customMessageValue: null };

  componentDidUpdate(prevProps) {
    const curr = this.props;
    if (!prevProps.data.community && curr.data.community) {
      return this.setState({
        customMessageValue: curr.data.community.brandedLogin.customMessage,
      });
    }
  }

  handleChange = e => {
    return this.setState({
      customMessageValue: e.target.value,
    });
  };

  saveCustomMessage = e => {
    e.preventDefault();
    const { customMessageValue } = this.state;
    return this.props
      .saveBrandedLoginCustomMessage({
        value: customMessageValue,
        id: this.props.data.community.id,
      })
      .then(() => {
        return this.props.dispatch(addToastWithTimeout('success', 'Saved!'));
      })
      .catch(err => {
        return this.props.dispatch(addToastWithTimeout('error', err));
      });
  };

  render() {
    const { data: { community }, isLoading } = this.props;
    if (community) {
      const { brandedLogin } = community;
      return (
        <SectionCard>
          <SectionTitle>Branded Login</SectionTitle>
          <SectionSubtitle>
            Display a custom login message when people are signing up to
            Spectrum directly from your community’s profile
          </SectionSubtitle>

          <BrandedLoginToggle settings={brandedLogin} id={community.id} />

          <form onSubmit={this.saveCustomMessage}>
            {brandedLogin.isEnabled && (
              <Input
                defaultValue={brandedLogin.customMessage}
                placeholder={'Set a custom message for the login screen'}
                onChange={this.handleChange}
              />
            )}

            {brandedLogin.isEnabled && (
              <SectionCardFooter
                style={{
                  flexDirection: 'row-reverse',
                  justifyContent: 'flex-start',
                }}
              >
                <Button
                  style={{ alignSelf: 'flex-start' }}
                  onSubmit={this.saveCustomMessage}
                  onClick={this.saveCustomMessage}
                >
                  Save
                </Button>

                <Link
                  to={`/${community.slug}/login`}
                  style={{ marginRight: '8px' }}
                >
                  <OutlineButton
                    color={'text.alt'}
                    style={{ alignSelf: 'flex-start' }}
                  >
                    Preview
                  </OutlineButton>
                </Link>
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
  saveBrandedLoginCustomMessage,
  connect()
)(BrandedLogin);
