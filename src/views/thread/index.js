// @flow
import React from 'react';
import Loadable from 'react-loadable';
import LoadingThread from './components/loading';

/* prettier-ignore */
const Thread = Loadable({
  loader: () => import('./container'/* webpackChunkName: "Thread" */),
  loading: ({ isLoading }) => isLoading && <LoadingThread />,
});

export default Thread;
