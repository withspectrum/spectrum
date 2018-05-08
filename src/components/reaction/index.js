// @flow
import * as React from 'react';
import Icon from '../icons';
import { addToastWithTimeout } from '../../actions/toasts';
import { ReactionWrapper } from '../message/style';
import type { GetMessageType } from 'shared/graphql/queries/message/getMessage';
import { track } from 'src/helpers/events';
import * as events from 'shared/analytics/event-types';

type Props = {
  toggleReaction: Function,
  dispatch: Function,
  currentUser?: Object,
  me: boolean,
  message: GetMessageType,
};

type State = {
  count: number,
  hasReacted: boolean,
};

class Reaction extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      count: props.message.reactions.count,
      hasReacted: props.message.reactions.hasReacted,
    };
  }

  doNothing = () => {};

  triggerMutation = () => {
    const { toggleReaction, message, dispatch, currentUser } = this.props;

    if (!currentUser) {
      return dispatch(
        addToastWithTimeout('error', 'Sign in first to leave a reaction!')
      );
    }

    const hasReacted = this.state.hasReacted;
    const count = this.state.count;

    const eventType = hasReacted
      ? events.REACTION_DELETED
      : events.REACTION_CREATED;

    track(eventType, {
      type: 'like',
      message: {
        id: message.id,
        parentId: message.parent ? message.parent.id : null,
      },
    });

    this.setState({
      hasReacted: !hasReacted,
      count: hasReacted ? count - 1 : count + 1,
    });

    toggleReaction({
      messageId: message.id,
      type: 'like',
    })
      // after the mutation occurs, it will either return an error or the new
      // thread that was published
      .then(({ data }) => {
        // can do something with the returned reaction here
      })
      .catch(error => {
        // TODO add some kind of dispatch here to show an error to the user
        dispatch(
          addToastWithTimeout(
            'error',
            "Couldn't quite save that reaction, try again?"
          )
        );

        this.setState({
          hasReacted,
          count,
        });
      });
  };

  render() {
    const { me, currentUser } = this.props;
    const { hasReacted, count } = this.state;

    return (
      <ReactionWrapper
        hasCount={count}
        hasReacted={hasReacted}
        me={me}
        hide={(me || !currentUser) && count === 0}
        onClick={me ? this.doNothing : this.triggerMutation}
        dummy={false}
      >
        <Icon
          glyph="like-fill"
          size={16}
          color={'text.reverse'}
          tipText={me ? 'Likes' : hasReacted ? 'Unlike' : 'Like'}
          tipLocation={me ? 'top-left' : 'top-right'}
        />
        <span>{count}</span>
      </ReactionWrapper>
    );
  }
}

export default Reaction;
