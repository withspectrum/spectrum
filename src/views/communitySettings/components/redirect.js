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
import { OutlineButton } from 'src/components/button';
import toggleCommunityRedirect from 'shared/graphql/mutations/community/toggleCommunityRedirect';
import toggleCommunityNofollow from 'shared/graphql/mutations/community/toggleCommunityNofollow';
import { addToastWithTimeout } from 'src/actions/toasts';
import type { Dispatch } from 'redux';

type Props = {
  community: GetCommunityType,
  toggleCommunityRedirect: Function,
  toggleCommunityNofollow: Function,
  dispatch: Dispatch<Object>,
};

type State = {
  isLoadingRedirect: boolean,
  isLoadingNofollow: boolean,
};

class RedirectSettings extends React.Component<Props, State> {
  state = {
    isLoadingRedirect: false,
  };

  toggleRedirect = e => {
    e.preventDefault();

    this.setState({
      isLoadingRedirect: true,
    });

    return this.props
      .toggleCommunityRedirect(this.props.community.id)
      .then(() => {
        this.setState({ isLoadingRedirect: false });
        return this.props.dispatch(
          addToastWithTimeout('success', 'Community redirect setting saved')
        );
      })
      .catch(err => {
        this.setState({ isLoadingRedirect: false });
        return this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  toggleNofollow = e => {
    e.preventDefault();

    this.setState({
      isLoadingNofollow: true,
    });

    return this.props
      .toggleCommunityNofollow(this.props.community.id)
      .then(() => {
        this.setState({ isLoadingNofollow: false });
        return this.props.dispatch(
          addToastWithTimeout('success', 'Community setting saved')
        );
      })
      .catch(err => {
        this.setState({ isLoadingNofollow: false });
        return this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const { community } = this.props;

    if (community) {
      return (
        <SectionCard data-cy="community-settings-redirect">
          <SectionTitle>Migrate your community elsewhere</SectionTitle>
          <SectionSubtitle style={{ marginTop: '8px' }}>
            Enabling this setting will redirect your community and channel pages
            to your community's website.
          </SectionSubtitle>
          <SectionSubtitle style={{ marginTop: '8px' }}>
            Existing conversations will stay accessible on Spectrum at their
            current URLs, but no new members can join and no new conversations
            can be created.
          </SectionSubtitle>
          <SectionSubtitle style={{ marginTop: '8px' }}>
            We recommend redirecting to a page that explains why users were
            redirected from Spectrum. For example, you can include a query param
            in your community website setting (e.g.{' '}
            <code>community.acme.com/?spectrum=true</code>) to show a special
            notice to users arriving there.
          </SectionSubtitle>
          <SectionCardFooter>
            <OutlineButton
              disabled={this.state.isLoadingRedirect}
              onClick={this.toggleRedirect}
              style={{ alignSelf: 'flex-start' }}
            >
              {this.state.isLoadingRedirect
                ? 'Loading...'
                : this.props.community.redirect
                ? 'Disable'
                : 'Enable'}
            </OutlineButton>
          </SectionCardFooter>
          {this.props.community.redirect && (
            <React.Fragment>
              <SectionCardFooter
                style={{ marginTop: '24px', paddingTop: '24px' }}
              >
                <SectionSubtitle>
                  Optional: Prevent threads in my community from being indexed
                  by search engines while redirection is active.
                </SectionSubtitle>
              </SectionCardFooter>
              <SectionCardFooter style={{ borderTop: '0', paddingTop: '0' }}>
                <OutlineButton
                  disabled={this.state.isLoadingNofollow}
                  onClick={this.toggleNofollow}
                  style={{ alignSelf: 'flex-start' }}
                >
                  {this.state.isLoadingNofollow
                    ? 'Loading...'
                    : this.props.community.nofollow
                    ? 'Disable'
                    : 'Enable'}
                </OutlineButton>
              </SectionCardFooter>
            </React.Fragment>
          )}
        </SectionCard>
      );
    }

    return null;
  }
}

export default compose(
  toggleCommunityRedirect,
  toggleCommunityNofollow,
  connect()
)(RedirectSettings);
