// @flow
import React from 'react';
import { Spinner } from '../globals';
import { HasNextPage, NextPageButton } from './style';

type Props = {
  isFetchingMore?: boolean,
  fetchMore: () => any,
};

const NextPageButtonWrapper = (props: Props) => {
  const { isFetchingMore, fetchMore } = props;
  return (
    <HasNextPage data-cy="load-previous-messages">
      <NextPageButton loading={isFetchingMore} onClick={() => fetchMore()}>
        {isFetchingMore ? (
          <Spinner size={16} color={'brand.default'} />
        ) : (
          'Load previous messages'
        )}
      </NextPageButton>
    </HasNextPage>
  );
};

export default NextPageButtonWrapper;
