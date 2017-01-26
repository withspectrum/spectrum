import React, { Component } from 'react';

class Message extends Component {
  render() {
    return (
      <div className="message">
        {this.props.data.fromName}
      </div>
    );
  }
};

export default Message;
