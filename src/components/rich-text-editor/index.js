// @flow
import React from 'react';
import Loadable from 'react-loadable';
import { Loading } from '../loading';

/* prettier-ignore */
const RichTextEditor = Loadable({
  loader: () => import('./container'/* webpackChunkName: "RichTextEditor" */),
  loading: ({ isLoading }) => isLoading && <Loading />,
});

export default RichTextEditor;
