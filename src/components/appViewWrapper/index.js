// @flow
import React from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import { withRouter } from 'react-router';
import { Wrapper } from './style';

const AppViewWrapperPure = (props: Object): React$Element<any> => (
  // Note(@mxstbr): This ID is needed to make infinite scrolling work
  // DO NOT REMOVE IT
  <Wrapper {...props} id="scroller-for-thread-feed">
    {props.children}
  </Wrapper>
);

const AppViewWrapper = compose(withRouter)(AppViewWrapperPure);
export default AppViewWrapper;
