// @flow
import React from 'react';
import Loadable from 'react-loadable';
import LoadingThread from './components/loading';
import ViewError from 'src/components/viewError';

/* prettier-ignore */
const loader = () => import('./container'/* webpackChunkName: "Thread" */);

const getLoading = (threadViewContext: 'fullscreen' | 'inbox' | 'slider') => ({
  error,
  pastDelay,
}) => {
  if (error) {
    return (
      <ViewError
        heading={'We had trouble loading the application, please try again.'}
        subheading={''}
      />
    );
  } else if (pastDelay) {
    return <LoadingThread threadViewContext={threadViewContext} />;
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
