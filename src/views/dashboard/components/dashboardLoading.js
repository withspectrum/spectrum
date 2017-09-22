// @flow
import React, { Component } from 'react';
import AppViewWrapper from '../../../components/appViewWrapper';
import Head from '../../../components/head';
import Titlebar from '../../../views/titlebar';
import { Column } from '../../../components/column';
import { Spinner } from '../../../components/globals';

class DashboardLoading extends Component {
  render() {
    const { title, description } = this.props;
    return (
      <AppViewWrapper>
        <Spinner />
      </AppViewWrapper>
    );
  }
}

export default DashboardLoading;
