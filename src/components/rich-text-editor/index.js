// @flow
import Loadable from 'react-loadable';

/* prettier-ignore */
const RichTextEditor = Loadable({
  loader: () => import('./container'/* webpackChunkName: "RichTextEditor" */),
  loading: ({ isLoading }) => isLoading && null,
});

export default RichTextEditor;
