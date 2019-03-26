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
  automatic?: boolean,
  topOffset?: number,
  bottomOffset?: number,
};

const NextPageButtonWrapper = (props: Props) => {
  const {
    isFetchingMore,
    fetchMore,
    href,
    children,
    automatic = true,
    topOffset = -250,
    bottomOffset = -250,
  } = props;
  const onChange = (isVisible: boolean) => {
    if (isFetchingMore || !isVisible) return;
    return fetchMore();
  };
  return (
    <HasNextPage
      as={href ? Link : 'div'}
      to={href}
      onClick={evt => {
        evt.preventDefault();
        onChange(true);
      }}
      data-cy="load-previous-messages"
    >
      <VisibilitySensor
        active={automatic !== false && !isFetchingMore}
        delayedCall
        partialVisibility
        scrollCheck
        intervalDelay={150}
        onChange={onChange}
        offset={{
          top: topOffset,
          bottom: bottomOffset,
        }}
      >
        <NextPageButton loading={isFetchingMore}>
          {isFetchingMore ? (
            <Spinner size={16} color={'brand.default'} />
          ) : (
            children || 'Load more'
          )}
        </NextPageButton>
      </VisibilitySensor>
    </HasNextPage>
  );
};

export default NextPageButtonWrapper;
