// @flow
// This component is shown as a full replacement for the entire app in production whenever an error happens that would otherwise crash the app
import React from 'react';
import ViewError from '../viewError';
import ErrorBoundary from './ErrorBoundary';
import SettingsFallback from './SettingsFallback';

const BlueScreen = () => {
  return (
    <ViewError
      heading={'Down for maintenance'}
      subheading={
        "Spectrum is currently down for maintenance. We'll be back soon!"
      }
    />
  );
};

export { ErrorBoundary, SettingsFallback };
export default BlueScreen;
