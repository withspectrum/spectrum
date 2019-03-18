// @flow
import React from 'react';
import { Spinner } from '../globals';
import { HasNextPage, NextPageButton } from './style';
import VisibilitySensor from 'react-visibility-sensor';
import { Link, type Location } from 'react-router-dom';

type Props = {
  isFetchingMore?: boolean,
  href?: Location,
  fetchMore: () => any,
  children?: string,
};

const NextPageButtonWrapper = (props: Props) => {
  const { isFetchingMore, fetchMore, href, children } = props;
  const onChange = (isVisible: boolean) => {
    if (isFetchingMore || !isVisible) return;
    return fetchMore();
  };
  return (
    <HasNextPage
      as={href ? Link : 'div'}
      to={href}
      data-cy="load-previous-messages"
    >
      <VisibilitySensor delayedCall onChange={onChange}>
        <NextPageButton loading={isFetchingMore}>
          {isFetchingMore ? (
            <Spinner size={16} color={'brand.default'} />
          ) : (
            children || 'Next page'
          )}
        </NextPageButton>
      </VisibilitySensor>
    </HasNextPage>
  );
};

export default NextPageButtonWrapper;
