// @flow
import React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { connect } from 'react-redux';
import { track } from '../../helpers/events';
import { getThisCommunity, getChannelsByCommunity } from './queries';
import { openModal } from '../../actions/modals';
import { displayLoadingScreen } from '../../components/loading';
import AppViewWrapper from '../../components/appViewWrapper';
import Column from '../../components/column';
import ListCard from './components/listCard';
import ImportSlack from './components/importSlack';
import EmailInvites from './components/emailInvites';
import { CommunityEditForm } from '../../components/editForm';
import CommunityMembers from '../../components/communityMembers';
import { Upsell404Community } from '../../components/upsell';
import Titlebar from '../titlebar';
const ChannelListCard = compose(getChannelsByCommunity)(ListCard);

const SettingsPure = ({
  match,
  history,
  data: { community, error },
  location,
  dispatch,
}) => {
  track('community', 'settings viewed', null);

  const communitySlug = match.params.communitySlug;

  const create = () => {
    return history.push('/new/community');
  };

  if (error) {
    return (
      <AppViewWrapper>
        <Titlebar
          title={`No Community Found`}
          provideBack={true}
          backRoute={`/${communitySlug}`}
          noComposer
        />
        <Column type="primary">
          <Upsell404Community community={communitySlug} />
        </Column>
      </AppViewWrapper>
    );
  }

  if (!community || community.deleted) {
    return (
      <AppViewWrapper>
        <Titlebar
          title={`No Community Found`}
          provideBack={true}
          backRoute={`/${communitySlug}`}
          noComposer
        />

        <Column type="primary">
          <Upsell404Community community={communitySlug} create={create} />
        </Column>
      </AppViewWrapper>
    );
  }

  if (!community.communityPermissions.isOwner) {
    return (
      <AppViewWrapper>
        <Titlebar
          title={`No Permission`}
          provideBack={true}
          backRoute={`/${communitySlug}`}
          noComposer
        />

        <Column type="primary">
          <Upsell404Community community={communitySlug} noPermission />
        </Column>
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
      </Column>
      <Column type="primary">
        <ImportSlack community={community} id={community.id} />
        <EmailInvites community={community} />
        <ChannelListCard slug={communitySlug} />
        <CommunityMembers id={community.id} />
      </Column>
    </AppViewWrapper>
  );
};

const CommunitySettings = compose(getThisCommunity, displayLoadingScreen, pure)(
  SettingsPure
);
export default connect()(CommunitySettings);
