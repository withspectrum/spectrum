// @flow
import React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';

import { getThisCommunity, getFrequenciesByCommunity } from './queries';

import AppViewWrapper from '../../components/appViewWrapper';
import Column from '../../components/column';
import ListCard from './components/listCard';

import { CommunitySettings } from '../../components/settings';

const ThisCommunitySettings = compose(getThisCommunity)(CommunitySettings);
const FrequencyListCard = compose(getFrequenciesByCommunity)(ListCard);

const SettingsPure = ({ match }) => {
  const communitySlug = match.params.communitySlug;
  return (
    <AppViewWrapper>
      <Column type="secondary">
        <ThisCommunitySettings slug={communitySlug} />
      </Column>
      <Column type="primary">
        <FrequencyListCard slug={communitySlug} />
      </Column>
    </AppViewWrapper>
  );
};

const Settings = compose(pure)(SettingsPure);
export default Settings;
