// @flow
import React from 'react';
import { Loading } from 'src/components/loading';
import { ViewGrid } from 'src/components/layout';

export const LoadingView = () => {
  return (
    <React.Fragment>
      <ViewGrid>
        <Loading />
      </ViewGrid>
    </React.Fragment>
  );
};
