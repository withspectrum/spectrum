// @flow
import React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';

import { getThisFrequency } from './queries';

import AppViewWrapper from '../../components/appViewWrapper';
import Column from '../../components/column';

import { FrequencyEditForm } from '../../components/editForm';

const ThisFrequencyEditForm = compose(getThisFrequency)(FrequencyEditForm);

const SettingsPure = ({ match }) => {
  const communitySlug = match.params.communitySlug;
  const frequencySlug = match.params.frequencySlug;
  return (
    <AppViewWrapper>
      <Column type="secondary">
        <ThisFrequencyEditForm slug={frequencySlug} community={communitySlug} />
      </Column>
      <Column type="primary" />
    </AppViewWrapper>
  );
};

const frequencySettings = compose(pure)(SettingsPure);
export default frequencySettings;
