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
import { displayLoadingCard } from '../../components/loading';
import { FrequencyEditForm } from '../../components/editForm';

const SettingsPure = ({ match, data, dispatch, history }) => {
  console.log(data);
  if (data.error) {
    return <div>error</div>;
  }

  if (!data.frequency.isOwner && !data.frequency.community.isOwner) {
    history.push('/');
    dispatch(
      addToastWithTimeout(
        'error',
        "You don't have permission to view these settings."
      )
    );
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

const FrequencySettings = compose(getThisFrequency, displayLoadingCard, pure)(
  SettingsPure
);
export default connect()(FrequencySettings);
