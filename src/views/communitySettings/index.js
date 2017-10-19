import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { getThisCommunity } from './queries';
import { Loading } from '../../components/loading';
import AppViewWrapper from '../../components/appViewWrapper';
import { Upsell404Community } from '../../components/upsell';
import viewNetworkHandler from '../../components/viewNetworkHandler';
import ViewError from '../../components/viewError';
import Analytics from '../communityAnalytics';
import Overview from './components/overview';
import Titlebar from '../titlebar';
import Header from './components/header';
import Subnav from './components/subnav';
import { View } from './style';

type Props = {};

class CommunitySettings extends React.Component<Props> {
  render() {
    const {
      match,
      data: { community },
      location,
      isLoading,
      hasError,
    } = this.props;

    // this is hacky, but will tell us if we're viewing analytics or the root settings view
    const pathname = location.pathname;
    const lastIndex = pathname.lastIndexOf('/');
    const activeRoute = pathname.substr(lastIndex + 1);
    const communitySlug = community && community.slug;

    if (community) {
      if (!community.communityPermissions.isOwner) {
        return (
          <AppViewWrapper>
            <Titlebar
              title={`No Permission`}
              provideBack={true}
              backRoute={`/${communitySlug}`}
              noComposer
            />

            <ViewError
              heading={`You don’t have permission to manage this community.`}
              subheading={`If you want to create your own community, you can get started below.`}
            >
              <Upsell404Community />
            </ViewError>
          </AppViewWrapper>
        );
      }

      const ActiveView = () => {
        switch (activeRoute) {
          case 'settings':
            return (
              <Overview community={community} communitySlug={communitySlug} />
            );
          case 'analytics':
            return (
              <Analytics community={community} communitySlug={communitySlug} />
            );
          default:
            return null;
        }
      };

      return (
        <AppViewWrapper>
          <Titlebar
            title={community.name}
            subtitle={'Settings'}
            provideBack={true}
            backRoute={`/${communitySlug}`}
            noComposer
          />

          <View>
            <Header community={community} />
            <Subnav communitySlug={communitySlug} active={activeRoute} />

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
            title={`Error fetching community`}
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
          title={`No Community Found`}
          provideBack={true}
          backRoute={`/${communitySlug}`}
          noComposer
        />
        <ViewError
          heading={`We weren’t able to find this community.`}
          subheading={`If you want to start the ${communitySlug} community yourself, you can get started below.`}
        >
          <Upsell404Community />
        </ViewError>
      </AppViewWrapper>
    );
  }
}

export default compose(connect(), getThisCommunity, viewNetworkHandler)(
  CommunitySettings
);
