import React, { Component } from 'react';
import ChatMessage from '../ChatMessage';

export default class ChatView extends Component{
  constructor(){
    super();
    this.state = {
      messages: [
        {
          userType: "op",
          fromName: "Jonathan Cutrell",
          text: "Hey man... that's not right."
        },
        {
          userType: "loggedIn",
          fromName: "Bryn Jackson",
          text: "If you say so. Personally, I think redux is confusing as hell."
        },
        {
          userType: "generic",
          fromName: "Brian Lovin",
          text: "nah u guise. i have it all figured out. i'm the redux master. the master of redux. u don't even know what ur talking about."
        }
      ]
    }
  }
	render() {
    let that = this;
		return (
      <div>
        {that.state.messages.map((thing, i) => <ChatMessage data={thing} key={i} />)} 
      </div>
	  );
	}
}
