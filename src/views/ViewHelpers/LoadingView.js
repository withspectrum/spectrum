// @flow
import React from 'react';
import { Loading } from 'src/components/loading';
import { LoadingTitlebar } from 'src/components/mobileTitlebar';
import { ViewGrid } from 'src/components/Layout';

export const LoadingView = () => {
  return (
    <ViewGrid>
      <LoadingTitlebar />
      <Loading />
    </ViewGrid>
  );
};
