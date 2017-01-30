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

  getUpvotes = () => {
    return Math.round(Math.random() * 150);
  }
  getCreatorName = () => {

  }

	render() {
    console.log(this.props);
		return (
	    	<StoryWrapper onClick={ this.setActiveStory }>
	    		<StoryHeader>
					  <Avatar src={this.props.data.creator.photoUrl} alt={this.props.data.creator.displayName} />
					  <UserMeta>
					    <Name>{this.props.data.creator.displayName}</Name>
					    <Meta>Just now • 20 Messages</Meta>
					  </UserMeta>
					  <UpvoteWrapper>
					  	<UpvoteButton>🔼 {this.getUpvotes()}</UpvoteButton>
					  </UpvoteWrapper>
					</StoryHeader>
	    		<StoryBody>
	    			<p>{this.props.data.content}</p>
	    			<StoryImg src="/img/media.png" role="presentation"/>
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
