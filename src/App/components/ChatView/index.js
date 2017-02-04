import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { ScrollBody, Bubble, BubbleGroup, FromName } from './style';
import * as Autolinker from 'autolinker'
import sanitizeHtml from 'sanitize-html'

class ChatView extends Component{

  componentWillUpdate() {
    var node = ReactDOM.findDOMNode(this);
    this.shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight || node.scrollTop === 0;
  }

  componentDidUpdate() {
    if (this.shouldScrollBottom) {
      var node = ReactDOM.findDOMNode(this);
      node.scrollTop = node.scrollHeight
    }
  }

  formatMessage(message){
    if (!message){ return "" }
    let cleanMessage = sanitizeHtml(message)
    let linkedMessage = Autolinker.link(cleanMessage)
    return linkedMessage
  }

  render() {
    let that = this
    console.log(this.props.messages)
		return (
      <ScrollBody>
        { this.props.messages &&
          this.props.messages.map((group, i) => {
            let me = this.props.user.uid;
            if (group[0].userId === me) {
              return( 
                <BubbleGroup key={i} me>
                  {group.map((message, i) => {
                    return <Bubble key={i} dangerouslySetInnerHTML={{__html: that.formatMessage(message.message)}}/>
                  })}
                </BubbleGroup>
              )
            }else{ 
              return( 
                <BubbleGroup key={i}>
                <FromName>{ group[0].userDisplayName }</FromName>
                  {group.map((message, i) => {
                    return <Bubble key={i} dangerouslySetInnerHTML={{__html: that.formatMessage(message.message)}} />
                  })}
                </BubbleGroup>
              )
            }
          })
        } 
      </ScrollBody>
	  );
	}
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    stories: state.stories,
    messages: state.messages.messages
  }
}

export default connect(mapStateToProps)(ChatView);
