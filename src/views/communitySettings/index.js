// @flow
import React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { connect } from 'react-redux';
import { getThisCommunity, getFrequenciesByCommunity } from './queries';
import { addToastWithTimeout } from '../../actions/toasts';
import { displayLoadingScreen } from '../../components/loading';
import AppViewWrapper from '../../components/appViewWrapper';
import Column from '../../components/column';
import ListCard from './components/listCard';

import { CommunityEditForm } from '../../components/editForm';
const FrequencyListCard = compose(getFrequenciesByCommunity)(ListCard);

const SettingsPure = ({ match, data, history, dispatch }) => {
  const communitySlug = match.params.communitySlug;

  if (data.error) {
    return <div>Error loading settings for this settings.</div>;
  }

  if (!data.community) {
    history.push('/');
    dispatch(addToastWithTimeout('error', "This community doesn't exist."));

    return null;
  }

  if (!data.community.isOwner) {
    history.push('/');
    dispatch(
      addToastWithTimeout(
        'error',
        "You don't have permission to view these settings."
      )
    );

    return null;
  }

  if (data.error) {
    return <div>Error</div>;
  }

  return (
    <AppViewWrapper>
      <Column type="secondary">
        <CommunityEditForm community={data.community} />
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
