import React, { Component } from 'react';
import Message from './Message';

class Chat extends Component{
	render() {
		return (
      <div>
        <div className="flex-auto flex lg-col-8 col-6 bg-default">
          <Message />
        </div>
      </div>
	  );
	}
}

export default Chat;
