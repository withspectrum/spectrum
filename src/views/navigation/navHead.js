// @flow
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import Head from 'src/components/head';

const NavHead = () => {
  return (
    <Head>
      <link
        rel="shortcut icon"
        id="dynamic-favicon"
        // $FlowIssue
        href={`${process.env.PUBLIC_URL}/img/favicon.ico`}
      />
    </Head>
  );
};

export default compose(connect())(NavHead);
