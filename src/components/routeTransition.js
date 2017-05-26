// @flow
import React from 'react';
//$FlowFixMe
import { RouteTransition } from 'react-router-transition';
//$FlowFixMe
import spring from 'react-motion/lib/spring';
const popConfig = { stiffness: 120, damping: 16 };

const WithTransition = ({ location: { pathname }, children }) => (
  <RouteTransition
    pathname={pathname}
    atEnter={{}}
    atLeave={{}}
    atActive={{}}
    mapStyles={styles => ({})}
  >
    {children}
  </RouteTransition>
);

export default WithTransition;
