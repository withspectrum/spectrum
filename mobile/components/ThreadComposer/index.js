// @flow
import React, { Fragment } from 'react';
import { TextInput } from 'react-native';

type Props = {||};

class ThreadComposer extends React.Component<Props> {
  render() {
    return (
      <Fragment>
        <TextInput autoFocus />
        <TextInput multiline />
      </Fragment>
    );
  }
}

export default ThreadComposer;
