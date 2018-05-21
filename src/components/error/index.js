// @flow
// This component is shown as a full replacement for the entire app in production whenever an error happens that would otherwise crash the app
import React from 'react';
import ViewError from '../viewError';
import SentryErrorBoundary from './SentryErrorBoundary';
import SettingsFallback from './SettingsFallback';

const BlueScreen = () => {
  return (
    <ViewError
      heading={'Something went wrong'}
      subheading={
        'Sorry about the technical issues. Brian, Bryn and Max have been notified of the problem and should resolve it soon.'
      }
      refresh
    />
  );
};

export { SentryErrorBoundary, SettingsFallback };
export default BlueScreen;
