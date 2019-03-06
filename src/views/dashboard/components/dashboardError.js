import React, { Component } from 'react';
import Head from 'src/components/head';
import Titlebar from 'src/views/titlebar';
import ViewError from 'src/components/viewError';

class DashboardError extends Component {
  render() {
    const { title, description } = this.props;
    return (
      <React.Fragment>
        <Head title={title} description={description} />
        <Titlebar noComposer />
        <ViewError refresh />
      </React.Fragment>
    );
  }
}

export default DashboardError;
