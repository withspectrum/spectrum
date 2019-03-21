// @flow
import React from 'react';
import { StyledSegmentedControl, StyledSegment } from './style';
import { Link } from 'react-router-dom';

type ControlProps = {
  sticky?: boolean,
  stickyOffset?: number,
  mobileSticky?: boolean,
  mobileStickyOffset?: number,
};

export const SegmentedControl = (props: ControlProps) => {
  const {
    sticky = true,
    stickyOffset = 0,
    mobileSticky = true,
    mobileStickyOffset = 0,
    ...rest
  } = props;
  return (
    <StyledSegmentedControl
      sticky={sticky}
      mobileSticky={mobileSticky}
      stickyOffset={stickyOffset}
      mobileStickyOffset={mobileStickyOffset}
      {...rest}
    />
  );
};

type SegmentProps = {
  isActive: boolean,
  hideOnDesktop?: boolean,
  to?: string,
};

export const Segment = (props: SegmentProps) => {
  const { isActive = false, hideOnDesktop = false, to, ...rest } = props;

  const component = (
    <StyledSegment
      isActive={isActive}
      hideOnDesktop={hideOnDesktop}
      {...rest}
    />
  );

  if (to) {
    return <Link to={to}>{component}</Link>;
  }

  return component;
};
