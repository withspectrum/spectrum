import React, { Component } from 'react';
import { Bubble, LeftBubble, RightBubble, OpBubble, BubbleGroup } from './style'

export default class ChatMessage extends Component {
  render() {
    return (
    	<BubbleGroup fromName={this.props.data.fromName}>
	      <LeftBubble>
	        {this.props.data.text}
	      </LeftBubble>
	      <LeftBubble>
	        {this.props.data.text}
	      </LeftBubble>
	      <LeftBubble>
	        {this.props.data.text}
	      </LeftBubble>
	      <LeftBubble>
	        {this.props.data.text}
	      </LeftBubble>
	    </BubbleGroup>
    );
  }
};
