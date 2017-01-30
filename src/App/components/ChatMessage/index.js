import React, { Component } from 'react';
import { OpBubble, BubbleGroup, FromName } from './style'

export default class ChatMessage extends Component {
  render() {
    return (
    		<BubbleGroup>
	    		<FromName>{this.props.data.userDisplayName}</FromName>
		      <OpBubble>
		        {this.props.data.message}
		      </OpBubble>
		    </BubbleGroup>
    );
  }
};
