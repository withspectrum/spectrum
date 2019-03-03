// @flow
import React from 'react';
import AppViewWrapper from 'src/components/appViewWrapper';
import { Loading } from 'src/components/loading';

export const LoadingView = () => {
  return (
    <AppViewWrapper>
      <Loading />
    </AppViewWrapper>
  );
};
