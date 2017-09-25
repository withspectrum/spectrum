// @flow
import React, { Component } from 'react';
import AppViewWrapper from '../../../components/appViewWrapper';
import { Spinner } from '../../../components/globals';

class DashboardLoading extends Component {
  render() {
    return (
      <AppViewWrapper>
        <Spinner />
      </AppViewWrapper>
    );
  }
}

export default DashboardLoading;
