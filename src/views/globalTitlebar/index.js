// @flow
import React from 'react';
import compose from 'recompose/compose';
import { withRouter, type History } from 'react-router-dom';
import { connect } from 'react-redux';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { MobileTitlebar } from 'src/components/titlebar';
import { ErrorBoundary } from 'src/components/error';
import { isViewingMarketingPage } from 'src/helpers/is-viewing-marketing-page';

export type TitlebarPayloadProps = {
  title: string,
  titleIcon?: React$Node,
  rightAction?: React$Node,
  leftAction?: React$Element<*> | 'menu' | 'view-back',
};

type TitlebarProps = {
  ...$Exact<TitlebarPayloadProps>,
  history: History,
  currentUser: ?Object,
};

const GlobalTitlebar = (props: TitlebarProps): React$Node => {
  const {
    title = 'Spectrum',
    titleIcon = null,
    rightAction = null,
    leftAction = 'menu',
    history,
    currentUser,
  } = props;

  if (isViewingMarketingPage(history, currentUser)) {
    return null;
  }

  return (
    <ErrorBoundary fallbackComponent={<MobileTitlebar title="Error" />}>
      <MobileTitlebar
        title={title}
        titleIcon={titleIcon}
        leftAction={leftAction}
        rightAction={rightAction}
      />
    </ErrorBoundary>
  );
};

const map = (state): * => state.titlebar;

export default compose(
  withRouter,
  withCurrentUser,
  connect(map)
)(GlobalTitlebar);
