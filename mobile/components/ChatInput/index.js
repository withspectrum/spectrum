// @flow
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { replyToMessage } from '../../../src/actions/message';
import Input, { type InputProps } from './input';
import { QuotedMessage } from '../Message/QuotedMessage';
import { getMessageById } from '../../../shared/graphql/queries/message/getMessage';
import type { Node } from 'react';

type Props = {
  // Don't let people pass in their own children, this container takes care of that
  ...$Diff<InputProps, { children: Node }>,
  dispatch: Function,
  quotedMessage?: string,
};

const QuotedMessageById = getMessageById(props => {
  if (props.data.loading || !props.data.message) return null;
  return <QuotedMessage noPadding message={props.data.message} />;
});

// Get the quoted message ID for the current thread
// by combining the navigation state + the redux state
const mapStateToProps = (state, ownProps): * => {
  const { state: navigationState } = ownProps.navigation;
  const threadViews = ['Thread'];
  const threadId =
    threadViews.indexOf(navigationState.routeName) >= 0
      ? navigationState.params.id
      : null;
  return {
    quotedMessage: threadId ? state.message.quotedMessage[threadId] : null,
  };
};

const ChatInputContainer = (props: Props) => {
  const { quotedMessage, dispatch, ...inputProps } = props;

  return (
    <Input {...inputProps}>
      {quotedMessage ? <QuotedMessageById id={quotedMessage} /> : null}
    </Input>
  );
};

export default compose(withNavigation, connect(mapStateToProps))(
  ChatInputContainer
);
