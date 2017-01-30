import React, { Component } from 'react';
import { connect } from 'react-redux'
import { StoryWrapper, StoryBody, StoryImg, StoryHeader, Avatar, UserMeta, Name, Meta, UpvoteWrapper, UpvoteButton } from './style';
import { setActiveStory } from '../../../actions/stories'
import { setMessages } from '../../../actions/messages'

class Story extends Component{

  setActiveStory = () => {
    this.props.dispatch(setActiveStory(this.props.data.id))
    this.props.dispatch(setMessages(this.props.data.id))
  }

	render() {
		return (
	    	<StoryWrapper selected onClick={ this.setActiveStory }>
	    		<StoryHeader>
					  <Avatar src="./img/avatar.jpg" alt="Bryn Jackson" />
					  <UserMeta>
					    <Name>Bryn Jackson</Name>
					    <Meta>Just now • No messages yet</Meta>
					  </UserMeta>
					  <UpvoteWrapper>
					  	<UpvoteButton>🔼 150</UpvoteButton>
					  </UpvoteWrapper>
					</StoryHeader>
	    		<StoryBody>
	    			<p>{this.props.data.content}</p>
	    			{/*<StoryImg src="/img/media.png" role="presentation"/>*/}
	    		</StoryBody>
    		</StoryWrapper>
	  );
	}
}

const mapStateToProps = (state) => {
  return {
    stories: state.stories,
  }
}

export default connect(mapStateToProps)(Story)