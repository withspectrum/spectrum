import React, { Component } from 'react';
import { connect } from 'react-redux';
import Card from '../../../shared/Card';
import { toggleMessageComposer } from '../../../actions/messageComposer';
import {
  MessageGroupContainer,
  MessageGroupImagesContainer,
  MessageGroupTextContainer,
  MessageGroupImage,
  MessageGroupByline,
  Usernames,
} from '../MessageGroup/style';

class NewMessageCard extends Component {
  toggleMessageComposer = () => {
    this.props.dispatch(toggleMessageComposer());
  };

  render() {
    const { active, recipient } = this.props;

    return (
      <Card nomargin onClick={this.toggleMessageComposer}>
        <MessageGroupContainer active={active}>
          <MessageGroupImagesContainer>
            <MessageGroupImage image={recipient.photoURL} />
          </MessageGroupImagesContainer>

          <MessageGroupTextContainer>
            <MessageGroupByline>
              <Usernames>
                <p>New message to {recipient.displayName}</p>
              </Usernames>
            </MessageGroupByline>
          </MessageGroupTextContainer>
        </MessageGroupContainer>
      </Card>
    );
  }
}

const mapStateToProps = state => {
  return {
    recipient: state.messageComposer.recipient,
  };
};

export default connect(mapStateToProps)(NewMessageCard);
