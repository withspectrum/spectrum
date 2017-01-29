import React, { Component } from 'react';
import { Bubble, LeftBubble, RightBubble, OpBubble, BubbleGroup, FromName } from './style'

export default class ChatMessage extends Component {
  render() {
    return (
    {
    	(props) => (props.date.userType == 'op' 
    	?
    		<BubbleGroup>
	    		<FromName>{this.props.data.fromName}</FromName>
		      <OpBubble>
		        {this.props.data.text}
		      </OpBubble>
		    </BubbleGroup>
	    :
	    	<BubbleGroup>
	    		<FromName>{this.props.data.fromName}</FromName>
		      <RightBubble>
		        {this.props.data.text}
		      </RightBubble>
		    </BubbleGroup>
	    )
    }
    );
  }
};
