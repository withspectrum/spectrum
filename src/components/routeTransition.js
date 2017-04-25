// @flow
import React from 'react';
//$FlowFixMe
import { RouteTransition } from 'react-router-transition';
//$FlowFixMe
import spring from 'react-motion/lib/spring';
const popConfig = { stiffness: 360, damping: 25 };

const WithTransition = ({ location: { pathname }, children }) => (
  <RouteTransition
    pathname={pathname}
    atEnter={{ scale: 0.98, translateY: 20, opacity: 0 }}
    atLeave={{ scale: 0.98, translateY: 20, opacity: spring(0, popConfig) }}
    atActive={{ scale: 1, translateY: 0, opacity: 1 }}
    mapStyles={styles => ({
      transform: `scale(${styles.scale}) translateY(${styles.translateY}px)`,
      opacity: styles.opacity,
    })}
  >
    {children}
  </RouteTransition>
);

export default WithTransition;
