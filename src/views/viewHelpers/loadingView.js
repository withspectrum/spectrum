// @flow
import React from 'react';
import { Loading } from 'src/components/loading';
import { LoadingTitlebar } from 'src/components/titlebar';
import { ViewGrid } from 'src/components/layout';

export const LoadingView = () => {
  return (
    <React.Fragment>
      <LoadingTitlebar />
      <ViewGrid>
        <Loading />
      </ViewGrid>
    </React.Fragment>
  );
};
