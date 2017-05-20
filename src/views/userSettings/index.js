//@flow
import React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
import { GetCurrentUserThreads } from './queries';

const UserSettings = props => {
  return <div>{console.log(props)}</div>;
};

export default compose(pure)(UserSettings);
