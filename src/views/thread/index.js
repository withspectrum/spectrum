// @flow
import React from 'react';
import Loadable from 'react-loadable';
import { ErrorView, LoadingView } from 'src/views/viewHelpers';

/* prettier-ignore */
const loader = () => import('./container'/* webpackChunkName: "Thread" */);

const getLoading = () => ({ error, pastDelay }) => {
  if (error) {
    return <ErrorView />;
  } else if (pastDelay) {
    return <LoadingView />;
  }

  return null;
};

export const ThreadView = Loadable({
  loader,
  loading: getLoading(),
  modules: ['./container'],
});
