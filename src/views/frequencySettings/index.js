// @flow
import React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
//$FlowFixMe
import { connect } from 'react-redux';
import { getThisFrequency } from './queries';
import AppViewWrapper from '../../components/appViewWrapper';
import Column from '../../components/column';
import { displayLoadingScreen } from '../../components/loading';
import { FrequencyEditForm } from '../../components/editForm';
import { Upsell404Frequency } from '../../components/upsell';

const SettingsPure = ({
  match,
  data: { error, frequency },
  dispatch,
  history,
}) => {
  const communitySlug = match.params.communitySlug;
  const frequencySlug = match.params.frequencySlug;

  if (error) {
    return (
      <Upsell404Frequency frequency={frequencySlug} community={communitySlug} />
    );
  }

  if (!frequency) {
    return (
      <Upsell404Frequency frequency={frequencySlug} community={communitySlug} />
    );
  }

  if (!frequency.isOwner && !frequency.community.isOwner) {
    return (
      <Upsell404Frequency
        frequency={frequencySlug}
        community={communitySlug}
        noPermission
      />
    );
  }

  return (
    <AppViewWrapper>
      <Column type="secondary">
        <FrequencyEditForm frequency={frequency} />
      </Column>
      <Column type="primary" />
    </AppViewWrapper>
  );
};

const FrequencySettings = compose(getThisFrequency, displayLoadingScreen, pure)(
  SettingsPure
);
export default connect()(FrequencySettings);
