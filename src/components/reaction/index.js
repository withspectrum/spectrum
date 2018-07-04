// @flow
import * as React from 'react';
import { addToastWithTimeout } from '../../actions/toasts';
import type { GetMessageType } from 'shared/graphql/queries/message/getMessage';
import type { Dispatch } from 'redux';

type Props = {
  toggleReaction: Function,
  dispatch: Dispatch<Object>,
  currentUser?: Object,
  me: boolean,
  message: GetMessageType,
  render: Function,
};

class Reaction extends React.Component<Props> {
  triggerMutation = () => {
    const { toggleReaction, message, dispatch, currentUser } = this.props;

    if (!currentUser) {
      return dispatch(
        addToastWithTimeout('error', 'Sign in first to leave a reaction!')
      );
    }

    return toggleReaction({
      messageId: message.id,
      type: 'like',
    });
  };

  render() {
    const { me, message: { reactions: { hasReacted, count } } } = this.props;
    const mutation = me ? () => {} : this.triggerMutation;

    return this.props.render({ me, hasReacted, count, mutation });
  }
}

export default Reaction;
