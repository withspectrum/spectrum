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

import { CommunityEditForm } from '../../components/editForm';

const ThisCommunityEditForm = compose(getThisCommunity)(CommunityEditForm);
const FrequencyListCard = compose(getFrequenciesByCommunity)(ListCard);

const SettingsPure = ({ match }) => {
  const communitySlug = match.params.communitySlug;
  return (
    <AppViewWrapper>
      <Column type="secondary">
        <ThisCommunityEditForm slug={communitySlug} />
      </Column>
      <Column type="primary">
        <FrequencyListCard slug={communitySlug} />
      </Column>
    </AppViewWrapper>
  );
};

const communitySettings = compose(pure)(SettingsPure);
export default communitySettings;
