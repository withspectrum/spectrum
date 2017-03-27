import React, { Component } from 'react';
import Card from '../../../shared/Card';

class MessageGroup extends Component {
  render() {
    const { messageGroup, link } = this.props;
    const userIds = Object.keys(messageGroup.users);

    return (
      <Card link={link}>
        Foo
      </Card>
    );
  }
}

export default MessageGroup;
