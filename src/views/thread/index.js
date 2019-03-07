// @flow
import React from 'react';
import Loadable from 'react-loadable';
import { ErrorView, LoadingView } from 'src/views/ViewHelpers';

/* prettier-ignore */
const loader = () => import('./container'/* webpackChunkName: "Thread" */);

const getLoading = (threadViewContext: 'fullscreen' | 'inbox' | 'slider') => ({
  error,
  pastDelay,
}) => {
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
  loading: getLoading('inbox'),
});

export const SliderThreadView = Loadable({
  loader,
  loading: getLoading('slider'),
});

export const FullscreenThreadView = Loadable({
  loader,
  loading: getLoading('fullscreen'),
});
