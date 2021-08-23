// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { getChannelByMatch } from 'shared/graphql/queries/channel/getChannel';
import type { GetChannelType } from 'shared/graphql/queries/channel/getChannel';
import Head from 'src/components/head';
import { Upsell404Channel } from 'src/components/upsell';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import ViewError from 'src/components/viewError';
import { View } from 'src/components/settingsViews/style';
import Header from 'src/components/settingsViews/header';
import Overview from './components/overview';
import type { Dispatch } from 'redux';
import { ErrorView, LoadingView } from 'src/views/viewHelpers';
import { ViewGrid } from 'src/components/layout';
import { setTitlebarProps } from 'src/actions/titlebar';

type Props = {
  data: {
    channel: GetChannelType,
  },
  location: Object,
  match: Object,
  isLoading: boolean,
  hasError: boolean,
  dispatch: Dispatch<Object>,
  history: Object,
};

class ChannelSettings extends React.Component<Props> {
  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(
      setTitlebarProps({
        title: 'Settings',
      })
    );
  }

  render() {
    const {
      data: { channel },
      match,
      location,
      isLoading,
    } = this.props;
    const { communitySlug } = match.params;

    // this is hacky, but will tell us if we're viewing analytics or the root settings view
    const pathname = location.pathname;
    const lastIndex = pathname.lastIndexOf('/');
    const activeTab = pathname.substr(lastIndex + 1);

    if (channel && channel.id) {
      const { isModerator, isOwner } = channel.channelPermissions;
      const userHasPermissions =
        isOwner ||
        isModerator ||
        channel.community.communityPermissions.isOwner ||
        channel.community.communityPermissions.isModerator;

      if (!userHasPermissions) {
        return (
          <React.Fragment>
            <ViewError
              heading={'You don’t have permission to manage this channel.'}
              subheading={`Head back to the ${
                channel.community.name
              } community to get back on track.`}
            >
              <Upsell404Channel community={communitySlug} />
            </ViewError>
          </React.Fragment>
        );
      }

      const ActiveView = () => {
        switch (activeTab) {
          case 'settings':
            return (
              <Overview
                community={channel.community}
                channel={channel}
                communitySlug={communitySlug}
              />
            );
          default:
            return null;
        }
      };

      const subheading = {
        to: `/${channel.community.slug}/settings`,
        label: `Return to ${channel.community.name} settings`,
      };

      return (
        <React.Fragment>
          <Head
            title={`${channel.name} settings`}
            description={`Settings for the ${channel.name} channel in ${
              channel.community.name
            }`}
          />
          <ViewGrid>
            <View>
              <Header
                subheading={subheading}
                heading={`${channel.name} Settings ${
                  channel.isArchived ? '(Archived)' : ''
                }`}
              />
              <ActiveView />
            </View>
          </ViewGrid>
        </React.Fragment>
      );
    }

    if (isLoading) {
      return <LoadingView />;
    }

    return <ErrorView />;
  }
}

export default compose(
  // $FlowIssue
  connect(),
  withRouter,
  getChannelByMatch,
  viewNetworkHandler
)(ChannelSettings);
