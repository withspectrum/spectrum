// @flow
import * as React from 'react';
import type { GetMessageType } from 'shared/graphql/queries/message/getMessage';
import type { Dispatch } from 'redux';

type Props = {
  dispatch: Dispatch<Object>,
  currentUser?: Object,
  me: boolean,
  message: GetMessageType,
  render: Function,
};

class Reaction extends React.Component<Props> {
  render() {
    const {
      me,
      message: {
        reactions: { hasReacted, count },
      },
    } = this.props;
    return this.props.render({ me, hasReacted, count });
  }
}

export default Reaction;
