// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { type GetCommunityType } from 'shared/graphql/queries/community/getCommunity';
import {
  SectionCard,
  SectionTitle,
  SectionSubtitle,
  SectionCardFooter,
} from 'src/components/settingsViews/style';
import { TextButton } from 'src/components/button';
import toggleCommunityRedirect from 'shared/graphql/mutations/community/toggleCommunityRedirect';
import { addToastWithTimeout } from 'src/actions/toasts';
import type { Dispatch } from 'redux';

type Props = {
  community: GetCommunityType,
  toggleCommunityRedirect: Function,
  dispatch: Dispatch<Object>,
};

type State = {
  isLoading: boolean,
};

class RedirectSettings extends React.Component<Props, State> {
  state = {
    isLoading: false,
  };

  toggle = e => {
    e.preventDefault();

    this.setState({
      isLoading: true,
    });

    return this.props
      .toggleCommunityRedirect(this.props.community.id)
      .then(() => {
        this.setState({ isLoading: false });
        return this.props.dispatch(
          addToastWithTimeout('success', 'Community redirect setting saved')
        );
      })
      .catch(err => {
        this.setState({ isLoading: false });
        return this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const { community } = this.props;

    if (community) {
      return (
        <SectionCard data-cy="community-settings-redirect">
          <SectionTitle>Migrate your community elsewhere</SectionTitle>
          <SectionSubtitle>
            Enabling this setting will redirect your community and channel pages
            to your community's website.
          </SectionSubtitle>
          <SectionSubtitle>
            Existing conversations will stay accessible on Spectrum at their
            current URLs, but no new members can join and no new conversations
            can be created.
          </SectionSubtitle>
          <SectionSubtitle>
            We recommend redirecting to a page that explains why users were
            redirected from Spectrum. For example, you can include a query param
            in your community website setting (e.g.{' '}
            <code>community.acme.com/?spectrum=true</code>) to show a special
            notice to users arriving there.
          </SectionSubtitle>
          <SectionCardFooter>
            <TextButton
              disabled={this.state.isLoading}
              onClick={this.toggle}
              style={{ alignSelf: 'flex-start' }}
            >
              {this.state.isLoading
                ? 'Loading...'
                : this.props.community.redirect
                ? 'Disable'
                : 'Enable'}
            </TextButton>
          </SectionCardFooter>
        </SectionCard>
      );
    }

    return null;
  }
}

export default compose(
  toggleCommunityRedirect,
  connect()
)(RedirectSettings);
