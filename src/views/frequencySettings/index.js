// @flow
import React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
//$FlowFixMe
import { connect } from 'react-redux';
import { getThisFrequency } from './queries';
import { addToastWithTimeout } from '../../actions/toasts';
import AppViewWrapper from '../../components/appViewWrapper';
import Column from '../../components/column';
import { displayLoadingScreen } from '../../components/loading';
import { FrequencyEditForm } from '../../components/editForm';

const SettingsPure = ({ match, data, dispatch, history }) => {
  if (data.error) {
    return <div>Error loading settings for this frequency.</div>;
  }

  if (!data.frequency) {
    history.push('/');
    dispatch(addToastWithTimeout('error', "This frequency doesn't exist."));

    // react elements must return a valid element or null
    return null;
  }

  if (!data.frequency.isOwner && !data.frequency.community.isOwner) {
    history.push('/');
    dispatch(
      addToastWithTimeout(
        'error',
        "You don't have permission to view these settings."
      )
    );

    // react elements must return a valid element or null
    return null;
  }

  return (
    <AppViewWrapper>
      <Column type="secondary">
        <FrequencyEditForm frequency={data.frequency} />
      </Column>
      <Column type="primary" />
    </AppViewWrapper>
  );
};

const FrequencySettings = compose(getThisFrequency, displayLoadingScreen, pure)(
  SettingsPure
);
export default connect()(FrequencySettings);
