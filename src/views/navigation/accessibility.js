// @flow
import React from 'react';
import { SkipLink } from './style';

export const Skip = () => <SkipLink href="#main">Skip to content</SkipLink>;

export const getAccessibilityActiveState = (active: boolean) => {
  return {
    'data-active': active,
    'aria-current': active ? 'page' : undefined,
  };
};
