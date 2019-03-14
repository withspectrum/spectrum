// @flow
import React from 'react';
import theme from 'shared/theme';
import BaseTitlebar from './base';

type Props = {
  title: string,
  leftAction: 'menu' | 'view-back' | $React.Element,
  titleIcon?: any,
  rightAction?: any,
  forceHistoryBack?: string,
  previousHistoryBackFallback?: string,
};

export const MobileTitlebar = (props: Props) => (
  <BaseTitlebar
    style={{ borderBottom: `1px solid ${theme.bg.border}` }}
    {...props}
  />
);

export const DesktopTitlebar = (props: Props) => (
  <BaseTitlebar
    desktop
    style={{
      borderBottom: `1px solid ${theme.bg.border}`,
      position: 'sticky',
      top: '0',
      zIndex: 9000,
    }}
    {...props}
  />
);
