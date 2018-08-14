// @flow
import React from 'react';
import Loadable from 'react-loadable';
import { LoadingThreadContent } from '../loading';
/* prettier-ignore */
const RichTextEditor = Loadable({
  loader: () => import('./container'/* webpackChunkName: "RichTextEditor" */),
  loading: ({ isLoading }) => isLoading && <LoadingThreadContent />,
});

export default RichTextEditor;
