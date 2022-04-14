// @flow
import React from 'react';
import { Loading } from 'src/components/loading';
import { ViewGrid, CenteredGrid } from 'src/components/layout';
import { Stretch } from './style';

export const LoadingView = () => {
  return (
    <React.Fragment>
      <ViewGrid>
        <CenteredGrid>
          <Stretch>
            <Loading />
          </Stretch>
        </CenteredGrid>
      </ViewGrid>
    </React.Fragment>
  );
};
