// @flow
import React, { Component } from 'react';
import AppViewWrapper from '../../../components/appViewWrapper';
import Head from '../../../components/head';
import Titlebar from '../../../views/titlebar';
import ViewError from '../../../components/viewError';

class DashboardError extends Component {
  render() {
    const { title, description } = this.props;
    return (
      <AppViewWrapper>
        <Head title={title} description={description} />
        <Titlebar noComposer />
        <ViewError refresh />
      </AppViewWrapper>
    );
  }
}

export default DashboardError;
