// @flow
import React from 'react';
import { Spinner } from '../globals';
import { HasNextPage, NextPageButton } from './style';
import VisibilitySensor from 'react-visibility-sensor';

type Props = {
  isFetchingMore?: boolean,
  fetchMore: () => any,
};

const NextPageButtonWrapper = (props: Props) => {
  const { isFetchingMore, fetchMore } = props;
  const onChange = (isVisible: boolean) => {
    if (isFetchingMore || !isVisible) return;
    return fetchMore();
  };
  return (
    <HasNextPage data-cy="load-previous-messages">
      <VisibilitySensor delayedCall onChange={onChange}>
        <NextPageButton loading={isFetchingMore}>
          <Spinner size={16} color={'brand.default'} />
        </NextPageButton>
      </VisibilitySensor>
    </HasNextPage>
  );
};

export default NextPageButtonWrapper;
