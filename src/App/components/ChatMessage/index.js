import React, { Component } from 'react';
import { Bubble, LeftBubble, RightBubble, OpBubble, BubbleGroup, FromName } from './style'

export default class ChatMessage extends Component {
  render() {
    return (
    		<BubbleGroup>
	    		<FromName>{this.props.data.fromName}</FromName>
		      <OpBubble>
		        {this.props.data.text}
		      </OpBubble>
		    </BubbleGroup>
    );
  }
};
