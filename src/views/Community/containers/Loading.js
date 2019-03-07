// @flow
import React from 'react';
import { Loading } from 'src/components/loading';
import { ViewGrid, CenteredGrid } from 'src/components/Layout';

export const LoadingView = () => {
  return (
    <ViewGrid>
      <CenteredGrid>
        <Loading />
      </CenteredGrid>
    </ViewGrid>
  );
};
