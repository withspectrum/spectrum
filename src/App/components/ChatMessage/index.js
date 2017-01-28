import React, { Component } from 'react';

export default class ChatMessage extends Component {
  render() {
    return (
      <div className="message">
        {this.props.data.fromName}
      </div>
    );
  }
};
