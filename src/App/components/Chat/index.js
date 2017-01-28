import React, { Component } from 'react';
import Message from '../Message';

class Chat extends Component{
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
      <div className="flex-auto flex lg-col-8 col-6 bg-default">
        {/*
          (function(){
            if (that.props.currentData.currentPost.id !== undefined){
              return that.state.messages.map(function(thing, i){
                return <Message data={thing} key={i} />
              });
            } else {
              return <div />;
            }
          }())
        */}
      </div>
	  );
	}
}

export default Chat;
