// @flow
import React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { connect } from 'react-redux';
import { getThisCommunity } from './queries';
import { Loading } from '../../components/loading';
import AppViewWrapper from '../../components/appViewWrapper';
import Column from '../../components/column';
import ChannelList from './components/channelList';
import ImportSlack from './components/importSlack';
import EmailInvites from './components/emailInvites';
import Invoices from './components/invoices';
import RecurringPaymentsList from './components/recurringPaymentsList';
import { CommunityEditForm } from '../../components/editForm';
import CommunityMembers from '../../components/communityMembers';
import { Upsell404Community } from '../../components/upsell';
import viewNetworkHandler from '../../components/viewNetworkHandler';
import ViewError from '../../components/viewError';
import Titlebar from '../titlebar';

const SettingsPure = ({
  match,
  history,
  data: { community },
  location,
  dispatch,
  isLoading,
  hasError,
}) => {
  const communitySlug = match.params.communitySlug;

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
            heading={`You dont’t have permission to manage this community.`}
            subheading={`If you want to create your own community, you can get started below.`}
          >
            <Upsell404Community />
          </ViewError>
        </AppViewWrapper>
      );
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

        <Column type="secondary">
          <CommunityEditForm community={community} />
          <RecurringPaymentsList community={community} />
        </Column>
        <Column type="primary">
          <ImportSlack community={community} id={community.id} />
          <EmailInvites community={community} />
          <ChannelList communitySlug={communitySlug} />
          <CommunityMembers id={community.id} />
          <Invoices id={community.id} />
        </Column>
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
};

const CommunitySettings = compose(getThisCommunity, viewNetworkHandler, pure)(
  SettingsPure
);
export default connect()(CommunitySettings);
