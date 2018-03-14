// @flow
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { getCommunitySettingsByMatch } from 'shared/graphql/queries/community/getCommunitySettings';
import type { GetCommunityType } from 'shared/graphql/queries/community/getCommunity';
import { Loading } from '../../components/loading';
import AppViewWrapper from '../../components/appViewWrapper';
import { Upsell404Community } from '../../components/upsell';
import viewNetworkHandler from '../../components/viewNetworkHandler';
import Head from '../../components/head';
import ViewError from '../../components/viewError';
import Analytics from '../communityAnalytics';
import Members from '../communityMembers';
import Billing from '../communityBilling';
import Overview from './components/overview';
import Titlebar from '../titlebar';
import Header from '../../components/settingsViews/header';
import Subnav from '../../components/settingsViews/subnav';
import { View } from './style';

type Props = {
  data: {
    community: GetCommunityType,
  },
  location: Object,
  isLoading: boolean,
  hasError: boolean,
  history: Object,
};

class CommunitySettings extends React.Component<Props> {
  render() {
    const {
      data: { community },
      location,
      isLoading,
      hasError,
      history,
    } = this.props;

    // this is hacky, but will tell us if we're viewing analytics or the root settings view
    const pathname = location.pathname;
    const lastIndex = pathname.lastIndexOf('/');
    const activeTab = pathname.substr(lastIndex + 1);
    const communitySlug = community && community.slug;

    if (community && community.id) {
      const canViewCommunitySettings =
        community.communityPermissions.isOwner ||
        community.communityPermissions.isModerator;

      if (!canViewCommunitySettings) {
        return (
          <AppViewWrapper>
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
          </AppViewWrapper>
        );
      }

      const ActiveView = () => {
        switch (activeTab) {
          case 'settings':
            return (
              <Overview community={community} communitySlug={communitySlug} />
            );
          case 'analytics':
            return <Analytics community={community} id={community.id} />;
          case 'members':
            return <Members community={community} history={history} />;
          case 'billing':
            return (
              <Billing
                community={community}
                id={community.id}
                history={history}
              />
            );
          default:
            return null;
        }
      };

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

      if (community.communityPermissions.isOwner) {
        subnavItems.push({
          to: `/${community.slug}/settings/billing`,
          label: 'Billing',
          activeLabel: 'billing',
        });
      }

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
        <AppViewWrapper>
          <Titlebar
            title={community.name}
            subtitle={'Settings'}
            provideBack={true}
            backRoute={`/${communitySlug}`}
            noComposer
          />
          <Head title={title} />

          <View>
            <Header
              avatar={avatar}
              subheading={subheading}
              heading={'Settings'}
            />
            <Subnav items={subnavItems} activeTab={activeTab} />

            <ActiveView />
          </View>
        </AppViewWrapper>
      );
    }

    if (isLoading) {
      return <Loading />;
    }

    if (hasError) {
      return (
        <AppViewWrapper>
          <Titlebar
            title={'Error fetching community'}
            provideBack={true}
            backRoute={`/${communitySlug}`}
            noComposer
          />
          <ViewError
            refresh
            error={hasError}
            heading={'There was an error fetching this community’s settings.'}
          />
        </AppViewWrapper>
      );
    }

    return (
      <AppViewWrapper>
        <Titlebar
          title={'No Community Found'}
          provideBack={true}
          backRoute={`/${communitySlug}`}
          noComposer
        />
        <ViewError
          heading={'We weren’t able to find this community.'}
          subheading={`If you want to start the ${communitySlug} community yourself, you can get started below.`}
        >
          <Upsell404Community />
        </ViewError>
      </AppViewWrapper>
    );
  }
}

export default compose(
  connect(),
  getCommunitySettingsByMatch,
  viewNetworkHandler
)(CommunitySettings);
