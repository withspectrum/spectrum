import React, { Component } from 'react';
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
    const { active } = this.props;
    return (
      <Card onClick={this.toggleMessageComposer}>
        <MessageGroupContainer active={active}>
          <MessageGroupImagesContainer>
            <MessageGroupImage loading />
          </MessageGroupImagesContainer>

          <MessageGroupTextContainer>
            <MessageGroupByline>
              <Usernames>
                <p>New Message...</p>
              </Usernames>
            </MessageGroupByline>
          </MessageGroupTextContainer>
        </MessageGroupContainer>
      </Card>
    );
  }
}

export default NewMessageCard;
