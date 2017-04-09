//@flow
import React, { Component } from 'react';
//$FlowFixMe
import { connect } from 'react-redux';
import { sortAndGroupBubbles } from '../../../helpers/utils';

import DirectMessageThread from './DirectMessageThread';
import DirectMessageComposer from './DirectMessageComposer';
import EmptyContainerIllustration
  from '../../Components/EmptyContainerIllustration';

type DirectMessagesContainerProps = {
  messageComposer: Object,
  messageGroups: Object,
  messages: Array<Object>,
};
class DirectMessagesContainer extends Component {
  props: DirectMessagesContainerProps;

  getActiveMessageGroup() {
    const { messageGroups: { messageGroups, active } } = this.props;

    return messageGroups.find(group => group.id === active);
  }

  render() {
    const { messageComposer, messages } = this.props;
    const activeMessageGroup = this.getActiveMessageGroup();

    if (messageComposer.isOpen) {
      return <DirectMessageComposer />;
    } else if (activeMessageGroup) {
      return (
        <DirectMessageThread active={activeMessageGroup} messages={messages} />
      );
    } else {
      return <EmptyContainerIllustration />;
    }
  }
}

const mapStateToProps = state => {
  const messages = state.messages.messages.filter(
    message => message.messageGroupId === state.messageGroups.active,
  );

  return {
    messageComposer: state.messageComposer,
    messageGroups: state.messageGroups,
    messages: sortAndGroupBubbles(messages),
  };
};
export default connect(mapStateToProps)(DirectMessagesContainer);
