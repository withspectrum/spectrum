// @flow
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import Head from 'src/components/head';

type Props = {
  notificationCounts: {
    notifications: number,
    directMessageNotifications: number,
  },
};

const NavHead = (props: Props) => {
  const { notificationCounts } = props;
  const { directMessageNotifications, notifications } = notificationCounts;
  const showBadgedFavicon = directMessageNotifications > 0 || notifications > 0;

  return (
    <Head>
      {showBadgedFavicon ? (
        <link
          rel="shortcut icon"
          id="dynamic-favicon"
          // $FlowIssue
          href={`${process.env.PUBLIC_URL}/img/favicon_unread.ico`}
        />
      ) : (
        <link
          rel="shortcut icon"
          id="dynamic-favicon"
          // $FlowIssue
          href={`${process.env.PUBLIC_URL}/img/favicon.ico`}
        />
      )}
    </Head>
  );
};

const map = (state): * => ({
  notificationCounts: state.notifications,
});

export default compose(connect(map))(NavHead);
