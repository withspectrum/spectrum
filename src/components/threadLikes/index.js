// @flow
import React from 'react';
import compose from 'recompose/compose';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';
import addThreadReactionMutation from 'shared/graphql/mutations/thread/addThreadReaction';
import removeThreadReactionMutation from 'shared/graphql/mutations/thread/removeThreadReaction';

import { IconButton } from 'src/components/buttons';
import Icon from 'src/components/icons';
import { LikeButtonWrapper, LikeCountWrapper, CurrentCount } from './style';

type LikeButtonProps = {
  thread: GetThreadType,
  addThreadReaction: Function,
  removeThreadReaction: Function,
};

const LikeButtonPure = (props: LikeButtonProps) => {
  const { thread } = props;
  const { hasReacted, count } = thread.reactions;

  const addThreadReaction = () => {
    const { thread, addThreadReaction } = props;
    const input = { threadId: thread.id };
    return addThreadReaction({ input });
  };

  const removeThreadReaction = () => {
    const { thread, removeThreadReaction } = props;
    const input = { threadId: thread.id };
    return removeThreadReaction({ input });
  };

  return (
    <LikeButtonWrapper hasReacted={hasReacted}>
      <IconButton
        glyph={hasReacted ? 'thumbsup-fill' : 'thumbsup'}
        tipText={hasReacted ? 'Unlike thread' : 'Like thread'}
        tipLocation={'bottom-left'}
        onClick={
          hasReacted ? () => removeThreadReaction() : () => addThreadReaction()
        }
      />
      <CurrentCount>{count}</CurrentCount>
    </LikeButtonWrapper>
  );
};

export const LikeButton = compose(
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

  if (count > 0) {
    return (
      <LikeCountWrapper active={active}>
        <Icon glyph={'thumbsup-fill'} size={24} />
        <CurrentCount>{count}</CurrentCount>
      </LikeCountWrapper>
    );
  } else {
    return null;
  }
};
