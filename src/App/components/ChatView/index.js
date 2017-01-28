import React, { Component } from 'react';
import ChatMessage from '../ChatMessage';

export default class ChatView extends Component{
  constructor(){
    super();
    this.state = {
      messages: [
        {
          fromName: "Jonathan Cutrell",
          text: "Hey man... that's not right."
        },
        {
          fromName: "Jonathan Cutrell",
          text: "Hey man... that's not right."
        },
      ]
    }
  }
	render() {
    let that = this;
		return (
      <div>
        {that.state.messages.map((thing, i) => { return <ChatMessage data={thing} key={i} />})} 
      </div>
	  );
	}
}
