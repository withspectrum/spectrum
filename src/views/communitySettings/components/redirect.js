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
import toggleCommunityNoindex from 'shared/graphql/mutations/community/toggleCommunityNoindex';
import { addToastWithTimeout } from 'src/actions/toasts';
import type { Dispatch } from 'redux';

type Props = {
  community: GetCommunityType,
  toggleCommunityRedirect: Function,
  toggleCommunityNoindex: Function,
  dispatch: Dispatch<Object>,
};

type State = {
  isLoadingRedirect: boolean,
  isLoadingNoindex: boolean,
};

class RedirectSettings extends React.Component<Props, State> {
  state = {
    isLoadingRedirect: false,
    isLoadingNoindex: false,
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

  toggleNoindex = e => {
    e.preventDefault();

    this.setState({
      isLoadingNoindex: true,
    });

    return this.props
      .toggleCommunityNoindex(this.props.community.id)
      .then(() => {
        this.setState({ isLoadingNoindex: false });
        return this.props.dispatch(
          addToastWithTimeout('success', 'Community setting saved')
        );
      })
      .catch(err => {
        this.setState({ isLoadingNoindex: false });
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
                  disabled={this.state.isLoadingNoindex}
                  onClick={this.toggleNoindex}
                  style={{ alignSelf: 'flex-start' }}
                >
                  {this.state.isLoadingNoindex
                    ? 'Loading...'
                    : this.props.community.noindex
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
  toggleCommunityNoindex,
  connect()
)(RedirectSettings);
