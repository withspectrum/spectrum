import React, { Component } from 'react';
import { connect } from 'react-redux'
// eslint-disable-next-line
import { StoryWrapper, StoryBody, StoryHeader, Avatar, UserMeta, Name, Meta, UpvoteWrapper, UpvoteButton, Title, Desc, Media } from './style';
import { setActiveStory, upvote } from '../../../actions/stories'
import { setMessages } from '../../../actions/messages'

class Story extends Component{

  setActiveStory = (e) => {
    this.props.dispatch(setActiveStory(this.props.data.id))
    this.props.dispatch(setMessages(this.props.data.id))
  }

  getUpvotes = () => {
    return Math.round(Math.random() * 150);
  }

  upvote = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    this.props.dispatch(upvote(this.props.data.id))
  }

  getUpvoteCount = () => {
    if (this.props.data.upvotes){
      return Object.keys(this.props.data.upvotes).length
    } else {
      return 0
    }
  }

	render() {
		return (
	    	<StoryWrapper selected onClick={ this.setActiveStory }>
	    		<StoryHeader>
					  <Avatar src={this.props.data.creator.photoURL} alt={this.props.data.creator.displayName} />
					  <UserMeta>
					    <Name>{this.props.data.creator.displayName}</Name>
					    <Meta>Just now • 20 Messages</Meta>
					  </UserMeta>
					  <UpvoteWrapper>
					  	<UpvoteButton onClick={this.upvote}>🔼 {this.getUpvoteCount()}</UpvoteButton>
					  </UpvoteWrapper>
					</StoryHeader>
	    		<StoryBody>
	    			<Title>{this.props.data.content.title}</Title>
            
            <Desc>{this.props.data.content.description}</Desc>
            
            {this.props.data.content.media && this.props.data.content.media !== ''
              ? <Media src={this.props.data.content.media} />
              : ''
            }

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
