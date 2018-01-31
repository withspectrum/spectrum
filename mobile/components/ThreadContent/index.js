// @flow
import React from 'react';
import renderer from './renderer';

type Props = {
  rawContentState: Object,
};

const ThreadContent = (props: Props) => {
  return renderer(props.rawContentState);
};

export default ThreadContent;
