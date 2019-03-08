// @flow
import React from 'react';
import Loadable from 'react-loadable';
import { ErrorView, LoadingView } from 'src/views/viewHelpers';

/* prettier-ignore */
const loader = () => import('./container'/* webpackChunkName: "Thread" */);

const getLoading = () => ({ error, pastDelay }) => {
  if (error) {
    console.error(error);
    return <ErrorView />;
  } else if (pastDelay) {
    return <LoadingView />;
  }

  return null;
};

export const InboxThreadView = Loadable({
  loader,
  loading: () => getLoading(),
});

export const SliderThreadView = Loadable({
  loader,
  loading: () => getLoading(),
});

export const FullscreenThreadView = Loadable({
  loader,
  loading: () => getLoading(),
});
