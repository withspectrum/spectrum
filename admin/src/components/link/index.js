// @flow
// This is our custom <Link /> component which applies an app update if one is available.
// See https://zach.codes/handling-client-side-app-updates-with-service-workers/ for more info
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { createLocation } from 'history';

type Props = {
  onClick?: Function,
  to: string | Object,
  replace: boolean,
  history: Object,
};

// Filter the withRouter props from being passed through to <Link />
export default withRouter(
  ({ staticContext, history, location, match, ...rest }: Props) => (
    <Link
      {...rest}
      onClick={evt => {
        if (rest.onClick) rest.onClick(evt);
        if (evt.metaKey || evt.ctrlKey) return;
        if (window.appUpdateAvailable === true) {
          evt.preventDefault();
          // This is copied from react-router's <Link /> component and is basically what it does internally
          const location =
            typeof rest.to === 'string'
              ? createLocation(rest.to, null, null, history.location)
              : rest.to;
          return (window.location = history.createHref(location));
        }
      }}
    />
  )
);
