// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import compose from 'recompose/compose';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';
import addThreadReactionMutation from 'shared/graphql/mutations/thread/addThreadReaction';
import removeThreadReactionMutation from 'shared/graphql/mutations/thread/removeThreadReaction';
import { openModal } from 'src/actions/modals';

import { IconButton } from 'src/components/buttons';
import Icon from 'src/components/icons';
import { LikeButtonWrapper, LikeCountWrapper, CurrentCount } from './style';

type LikeButtonProps = {
  thread: GetThreadType,
  addThreadReaction: Function,
  removeThreadReaction: Function,
  currentUser: ?Object,
  tipLocation?: string,
  dispatch: Dispatch<Object>,
};

class LikeButtonPure extends React.Component<LikeButtonProps> {
  handleClick = () => {
    const { thread, dispatch, currentUser } = this.props;

    if (!currentUser || !currentUser.id) {
      return dispatch(openModal('CHAT_INPUT_LOGIN_MODAL', {}));
    }

    const { hasReacted } = thread.reactions;
    return hasReacted ? this.removeThreadReaction() : this.addThreadReaction();
  };

  addThreadReaction = () => {
    const { thread, addThreadReaction } = this.props;
    const input = { threadId: thread.id };
    return addThreadReaction({ input });
  };

  removeThreadReaction = () => {
    const { thread, removeThreadReaction } = this.props;
    const input = { threadId: thread.id };
    return removeThreadReaction({ input });
  };

  render() {
    const { thread, tipLocation = 'bottom-left' } = this.props;
    const { hasReacted, count } = thread.reactions;

    return (
      <LikeButtonWrapper hasReacted={hasReacted}>
        <IconButton
          glyph={'thumbsup'}
          tipText={hasReacted ? 'Unlike thread' : 'Like thread'}
          tipLocation={tipLocation}
          onClick={this.handleClick}
        />
        <CurrentCount>{count}</CurrentCount>
      </LikeButtonWrapper>
    );
  }
}

const map = state => ({
  currentUser: state.users.currentUser,
});
export const LikeButton = compose(
  // $FlowFixMe
  connect(map),
  addThreadReactionMutation,
  removeThreadReactionMutation
)(LikeButtonPure);

type LikeCountProps = {
  active: boolean,
  thread: GetThreadType,
};

export const LikeCount = (props: LikeCountProps) => {
  const { active, thread } = props;
  const { count } = thread.reactions;
  return (
    <LikeCountWrapper hasReacted={thread.reactions.hasReacted} active={active}>
      <Icon
        glyph={'thumbsup'}
        size={24}
        tipText={`${count} likes`}
        tipLocation={'top-right'}
      />
      <CurrentCount>{count || '0'}</CurrentCount>
    </LikeCountWrapper>
  );
};
