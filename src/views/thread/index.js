// @flow
import React from 'react';
import Loadable from 'react-loadable';
import { LoadingView } from 'src/views/viewHelpers';

/* prettier-ignore */
const loader = () => import('./container'/* webpackChunkName: "Thread" */);

export const InboxThreadView = Loadable({
  loader,
  loading: <LoadingView />,
});

export const SliderThreadView = Loadable({
  loader,
  loading: <LoadingView />,
});

export const FullscreenThreadView = Loadable({
  loader,
  loading: <LoadingView />,
});
