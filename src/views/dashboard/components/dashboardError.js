// @flow
import React, { Component } from 'react';
import AppViewWrapper from '../../../components/appViewWrapper';
import Head from '../../../components/head';
import Titlebar from '../../../views/titlebar';
import { Column } from '../../../components/column';
import { UpsellToReload } from '../../../components/upsell';

class DashboardLoading extends Component {
  render() {
    const { title, description } = this.props;
    return (
      <AppViewWrapper>
        <Head title={title} description={description} />
        <Titlebar noComposer />
        <Column type="primary" alignItems="center">
          <UpsellToReload />
        </Column>
      </AppViewWrapper>
    );
  }
}

export default DashboardLoading;
