//@flow
import React, { Component } from 'react';
//$FlowFixMe
import deepEqual from 'deep-eql';
//$FlowFixMe
import { connect } from 'react-redux';

import { Header } from './header';
import { Container } from './container';
import { ScrollBody } from './ScrollBody';
import Chat from '../../Components/Chat';
import ChatInput from '../../Components/ChatInput';
import { openModal } from '../../../../actions/modals';
import { setMessageGroupLastSeen } from '../../../../db/messageGroups';

class DirectMessageThread extends Component {
  static defaultProps = {
    active: React.PropTypes.object.isRequired,
  };

  openUpgradeModal = () => {
    const { user } = this.props;
    this.props.dispatch(openModal('UPGRADE_MODAL', user));
  };

  shouldComponentUpdate(nextProps: Object) {
    return !deepEqual(nextProps, this.props);
  }

  forceScrollToBottom = () => {
    // calls the child method on ScrollBody to force a scroll to bottom when the current user sends a message
    this.scroll.forceScrollToBottom();
  };

  setLastSeen = () => {
    const { user: { uid }, activeThread: { id } } = this.props;
    setMessageGroupLastSeen(uid, id);
  };

  render() {
    const { user, messages, activeThread } = this.props;
    const usersList = user.list;
    const currentUser = user;

    const users = Object.keys(activeThread.users)
      .map(user => usersList[user]) // get the user objects
      .filter(user => user.uid !== currentUser.uid); // filter out the current user

    return (
      <Container>
        <ScrollBody active={activeThread} ref={scroll => this.scroll = scroll}>
          <Header users={users} openUpgradeModal={this.openUpgradeModal} />
          <Chat
            messages={messages}
            usersList={usersList}
            currentUser={currentUser}
            type={'groupMessage'}
          />
        </ScrollBody>
        <ChatInput
          forceScrollToBottom={this.forceScrollToBottom}
          setLastSeen={this.setLastSeen}
        />
      </Container>
    );
  }
}

const mapStateToProps = (state: Object) => ({
  user: state.user,
});
export default connect(mapStateToProps)(DirectMessageThread);
