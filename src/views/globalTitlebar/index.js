// @flow
import React from 'react';
import { connect } from 'react-redux';
import { MobileTitlebar } from 'src/components/titlebar';
import { ErrorBoundary } from 'src/components/error';

export type TitlebarProps = {
  title: string,
  titleIcon?: React.Node,
  rightAction?: React.Node,
  leftAction?: React.Node,
};

const GlobalTitlebar = (props: Props): React.Node => {
  const {
    title = 'Spectrum',
    titleIcon = null,
    rightAction = null,
    leftAction = 'menu',
  } = props;

  return (
    <ErrorBoundary fallbackComponent={<MobileTitlebar />}>
      <MobileTitlebar
        title={title}
        titleIcon={titleIcon}
        leftAction={leftAction}
        rightAction={rightAction}
      />
    </ErrorBoundary>
  );
};

const map = state => state.titlebar;

export default connect(map)(GlobalTitlebar);
