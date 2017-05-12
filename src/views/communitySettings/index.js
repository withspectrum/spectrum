// @flow
import React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { connect } from 'react-redux';
import { getThisCommunity, getFrequenciesByCommunity } from './queries';
import { openModal } from '../../actions/modals';
import { displayLoadingScreen } from '../../components/loading';
import AppViewWrapper from '../../components/appViewWrapper';
import Column from '../../components/column';
import ListCard from './components/listCard';
import { CommunityEditForm } from '../../components/editForm';
import { Upsell404Community } from '../../components/upsell';
const FrequencyListCard = compose(getFrequenciesByCommunity)(ListCard);

const SettingsPure = ({
  match,
  data: { community, error },
  history,
  dispatch,
}) => {
  const communitySlug = match.params.communitySlug;

  const create = () => {
    return dispatch(
      openModal('CREATE_COMMUNITY_MODAL', { name: communitySlug })
    );
  };

  if (error) {
    return <Upsell404Community community={communitySlug} />;
  }

  if (!community) {
    return <Upsell404Community community={communitySlug} create={create} />;
  }

  if (!community.isOwner) {
    return <Upsell404Community community={communitySlug} noPermission />;
  }

  return (
    <AppViewWrapper>
      <Column type="secondary">
        <CommunityEditForm community={community} />
      </Column>
      <Column type="primary">
        <FrequencyListCard slug={communitySlug} />
      </Column>
    </AppViewWrapper>
  );
};

const CommunitySettings = compose(getThisCommunity, displayLoadingScreen, pure)(
  SettingsPure
);
export default connect()(CommunitySettings);
