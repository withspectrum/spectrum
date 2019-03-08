// @flow
import React from 'react';
import Loadable from 'react-loadable';
import { LoadingView } from 'src/views/viewHelpers';

/* prettier-ignore */
const DirectMessages = Loadable({
  loader: () => import('./containers/index.js'/* webpackChunkName: "DirectMessages" */),
  loading: ({ isLoading }) => isLoading && <LoadingView />,
});

export default DirectMessages;
