// @flow
// This is our custom <Link /> component which applies an app update if one is available.
// See https://zach.codes/handling-client-side-app-updates-with-service-workers/ for more info
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { createLocation } from 'history';
import LINK_PROPS from './props';

type Props = {
  onClick?: Function,
  to: string | Object,
  replace: boolean,
  history: Object,
};

// Filter out all props that are invalid on an `a` element.
const filterProps = (props: Object) => {
  const addToProps = (acc, prop) => {
    acc[prop] = props[prop];

    return acc;
  };

  // All attributes starting with `data-` are valid HTML5 attributes.
  const dataAttributesProps = Object.keys(props).filter(propName =>
    propName.startsWith('data-')
  );
  const allowedProps = LINK_PROPS.reduce(addToProps, {});

  return dataAttributesProps.reduce(addToProps, allowedProps);
};

export default withRouter((props: Props) => (
  <Link
    {...filterProps(props)}
    onClick={evt => {
      if (props.onClick) props.onClick(evt);
      if (evt.metaKey || evt.ctrlKey) return;
      if (window.appUpdateAvailable === true) {
        evt.preventDefault();
        // This is copied from react-router's <Link /> component and is basically what it does internally
        const location =
          typeof props.to === 'string'
            ? createLocation(props.to, null, null, props.history.location)
            : props.to;
        return (window.location = props.history.createHref(location));
      }
    }}
  />
));
