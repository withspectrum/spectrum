import React, { Component } from 'react';
import Icon from '../icons';
import { track } from '../../helpers/events';
import { addToastWithTimeout } from '../../actions/toasts';
import { ReactionWrapper, Count } from './style';

class Reaction extends Component {
  state: {
    count: number,
    hasReacted: boolean,
  };

  constructor(props) {
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

    track('reaction', hasReacted ? 'removed' : 'created', null);

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
        active={hasReacted}
        me={me}
        hide={(me || !currentUser) && count === 0}
        onClick={me ? this.doNothing : this.triggerMutation}
        dummy={false}
      >
        <Icon glyph="like-fill" size={16} color={'text.reverse'} />
        <Count>{count}</Count>
      </ReactionWrapper>
    );
  }
}

export default Reaction;
