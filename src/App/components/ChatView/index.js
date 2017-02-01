import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScrollBody, Bubble, BubbleGroup, FromName } from './style';

class ChatView extends Component{

  componentWillUpdate() {
    var node = this.getDOMNode();
    this.shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight;
  }

  componentDidUpdate() {
    if (this.shouldScrollBottom) {
      var node = this.getDOMNode();
      node.scrollTop = node.scrollHeight
    }
  }

  render() {
		return (
      <ScrollBody>
        { this.props.messages &&
          this.props.messages.map((group, i) => {
            let me = this.props.user.uid;
            if (group[0].userId === me) {
              return( 
                <BubbleGroup key={i} me>
                  {group.map((message, i) => {
                    return <Bubble key={i}>{message.message}</Bubble>
                  })}
                </BubbleGroup>
              )
            }else{ 
              return( 
                <BubbleGroup key={i}>
                <FromName>{ group[0].userDisplayName }</FromName>
                  {group.map((message, i) => {
                    return <Bubble key={i}>{message.message}</Bubble>
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
