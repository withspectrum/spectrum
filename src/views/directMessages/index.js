// @flow
import React from 'react';
import Loadable from 'react-loadable';
import LoadingDMs from './components/loading';

/* prettier-ignore */
const DirectMessages = Loadable({
  loader: () => import('./containers/index.js'/* webpackChunkName: "DirectMessages" */),
  loading: ({ isLoading }) => isLoading && <LoadingDMs />,
});

export default DirectMessages;
