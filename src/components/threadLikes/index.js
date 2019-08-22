// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import compose from 'recompose/compose';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';
import addThreadReactionMutation from 'shared/graphql/mutations/thread/addThreadReaction';
import removeThreadReactionMutation from 'shared/graphql/mutations/thread/removeThreadReaction';
import { openModal } from 'src/actions/modals';
import { addToastWithTimeout } from 'src/actions/toasts';
import Icon from 'src/components/icon';
import { LikeButtonWrapper, LikeCountWrapper, CurrentCount } from './style';
import { withCurrentUser } from 'src/components/withCurrentUser';

type LikeButtonProps = {
  thread: GetThreadType,
  addThreadReaction: Function,
  removeThreadReaction: Function,
  currentUser: ?Object,
  dispatch: Dispatch<Object>,
};

class LikeButtonPure extends React.Component<LikeButtonProps> {
  handleClick = () => {
    const { thread, dispatch, currentUser } = this.props;

    if (!currentUser || !currentUser.id) {
      return dispatch(openModal('LOGIN_MODAL', {}));
    }

    const { hasReacted } = thread.reactions;
    return hasReacted ? this.removeThreadReaction() : this.addThreadReaction();
  };

  addThreadReaction = () => {
    const { thread, addThreadReaction, dispatch } = this.props;
    const input = { threadId: thread.id };
    return addThreadReaction({ input }).catch(err =>
      dispatch(addToastWithTimeout('error', err.message))
    );
  };

  removeThreadReaction = () => {
    const { thread, removeThreadReaction, dispatch } = this.props;
    const input = { threadId: thread.id };
    return removeThreadReaction({ input }).catch(err =>
      dispatch(addToastWithTimeout('error', err.message))
    );
  };

  render() {
    const { thread } = this.props;
    const { hasReacted, count } = thread.reactions;

    return (
      <LikeButtonWrapper hasReacted={hasReacted} onClick={this.handleClick}>
        <Icon style={{ pointerEvents: 'none' }} glyph="thumbsup" size={24} />
        {hasReacted ? 'Liked' : 'Like'}
        <CurrentCount>{count}</CurrentCount>
      </LikeButtonWrapper>
    );
  }
}

export const LikeButton = compose(
  addThreadReactionMutation,
  removeThreadReactionMutation,
  withCurrentUser,
  connect()
)(LikeButtonPure);

type LikeCountProps = {
  active: boolean,
  thread: GetThreadType,
};

export const LikeCount = (props: LikeCountProps) => {
  const { active, thread } = props;
  const { count, hasReacted } = thread.reactions;
  return (
    <LikeCountWrapper active={active}>
      {hasReacted ? (
        <Icon glyph={'thumbsup-fill'} size={24} />
      ) : (
        <Icon glyph={'thumbsup'} size={24} />
      )}
      <CurrentCount>{count || '0'}</CurrentCount>
    </LikeCountWrapper>
  );
};
