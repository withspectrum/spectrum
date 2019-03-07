// @flow
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { getCommunitySettingsByMatch } from 'shared/graphql/queries/community/getCommunitySettings';
import type { GetCommunityType } from 'shared/graphql/queries/community/getCommunity';
import { Loading } from '../../components/loading';
import { Upsell404Community } from '../../components/upsell';
import viewNetworkHandler from '../../components/viewNetworkHandler';
import Head from '../../components/head';
import ViewError from '../../components/viewError';
import Analytics from '../communityAnalytics';
import Members from '../communityMembers';
import Overview from './components/overview';
import Titlebar from '../titlebar';
import Header from '../../components/settingsViews/header';
import { SegmentedControl, Segment } from 'src/components/segmentedControl';
import { View } from './style';
import type { ContextRouter } from 'react-router';
import { track, events, transformations } from 'src/helpers/analytics';
import { ErrorView, LoadingView } from 'src/views/ViewHelpers';

type Props = {
  data: {
    community: GetCommunityType,
  },
  isLoading: boolean,
  hasError: boolean,
  ...$Exact<ContextRouter>,
};

class CommunitySettings extends React.Component<Props> {
  componentDidUpdate(prevProps) {
    if (!prevProps.data.community && this.props.data.community) {
      const { community } = this.props.data;
      track(events.COMMUNITY_SETTINGS_VIEWED, {
        community: transformations.analyticsCommunity(community),
      });
    }
  }

  render() {
    const {
      data: { community },
      location,
      match,
      isLoading,
      hasError,
      history,
    } = this.props;

    // this is hacky, but will tell us if we're viewing analytics or the root settings view
    const pathname = location.pathname;
    const lastIndex = pathname.lastIndexOf('/');
    const activeTab = pathname.substr(lastIndex + 1);
    const communitySlug = match.params.communitySlug;

    if (community && community.id) {
      const canViewCommunitySettings =
        community.communityPermissions.isOwner ||
        community.communityPermissions.isModerator;

      if (!canViewCommunitySettings) {
        return (
          <React.Fragment>
            <Titlebar
              title={'No Permission'}
              provideBack={true}
              backRoute={`/${communitySlug}`}
              noComposer
            />

            <ViewError
              heading={'You don’t have permission to manage this community.'}
              subheading={
                'If you want to create your own community, you can get started below.'
              }
            >
              <Upsell404Community />
            </ViewError>
          </React.Fragment>
        );
      }

      const subnavItems = [
        {
          to: `/${community.slug}/settings`,
          label: 'Overview',
          activeLabel: 'settings',
        },
        {
          to: `/${community.slug}/settings/members`,
          label: 'Members',
          activeLabel: 'members',
        },
        {
          to: `/${community.slug}/settings/analytics`,
          label: 'Analytics',
          activeLabel: 'analytics',
        },
      ];

      const subheading = {
        to: `/${community.slug}`,
        label: `Return to ${community.name}`,
      };

      const avatar = {
        profilePhoto: community.profilePhoto,
        community,
      };

      const activeItem = subnavItems.find(
        ({ activeLabel }) => activeLabel === activeTab
      );
      let title = community.name;
      if (activeItem && activeItem.label !== 'Settings') {
        title += ` ${activeItem.label} Settings`;
      } else {
        title += ' Settings';
      }
      return (
        <React.Fragment>
          <Titlebar
            title={community.name}
            subtitle={'Settings'}
            provideBack={true}
            backRoute={`/${communitySlug}`}
            noComposer
          />
          <Head title={title} />

          <View data-cy="community-settings" id="main">
            <Header
              avatar={avatar}
              subheading={subheading}
              heading={'Settings'}
            />

            <SegmentedControl>
              {subnavItems.map(item => (
                <Segment
                  key={item.label}
                  to={item.to}
                  isActive={activeTab === item.activeLabel}
                >
                  {item.label}
                </Segment>
              ))}
            </SegmentedControl>

            <Switch>
              <Route path={`${match.url}/analytics`}>
                {() => <Analytics community={community} id={community.id} />}
              </Route>
              <Route path={`${match.url}/members`}>
                {() => <Members community={community} history={history} />}
              </Route>
              <Route path={`${match.url}`}>
                {() => (
                  <Overview
                    community={community}
                    communitySlug={communitySlug}
                  />
                )}
              </Route>
            </Switch>
          </View>
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
  connect(),
  getCommunitySettingsByMatch,
  viewNetworkHandler
)(CommunitySettings);
