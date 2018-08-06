// @flow
import React from 'react';
import compose from 'recompose/compose';
import { withRouter } from 'react-router';
import { Wrapper } from './style';

const AppViewWrapperPure = (props: Object): React$Element<any> => (
  // Note(@mxstbr): This ID is needed to make infinite scrolling work
  // DO NOT REMOVE IT
  <Wrapper {...props} id="scroller-for-thread-feed">
    {props.children}
  </Wrapper>
);

export default compose(withRouter)(AppViewWrapperPure);
