import React, { Component } from 'react';
import Card from '../../../shared/Card';
import {
  MessageGroupContainer,
  MessageGroupImagesContainer,
  MessageGroupTextContainer,
  MessageGroupImage,
  MessageGroupByline,
  Usernames,
} from '../MessageGroup/style';

class NewMessageCard extends Component {
  render() {
    return (
      <Card>
        <MessageGroupContainer active={true}>
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
