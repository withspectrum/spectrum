// @flow
import React from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import { withRouter } from 'react-router';
import { Wrapper } from './style';

const AppViewWrapperPure = (props: Object): React$Element<any> => (
  <Wrapper>
    {props.children}
  </Wrapper>
);

const AppViewWrapper = compose(withRouter, pure)(AppViewWrapperPure);
export default AppViewWrapper;
