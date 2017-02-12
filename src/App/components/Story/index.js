import React, { Component } from 'react';
import { connect } from 'react-redux'
// eslint-disable-next-line
import { StoryWrapper, StoryBody, StoryHeader, Avatar, UserMeta, Name, Meta, UpvoteWrapper, UpvoteLabel, Title, Desc, Media } from './style';
import actions from '../../../actions'

class Story extends Component{
  getUpvotes = () => {
    return Math.round(Math.random() * 150);
  }

  upvote = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    this.props.dispatch(actions.upvote(this.props.data.id))
  }

  getUpvoteCount = () => {
    if (this.props.data.upvotes){
      return Object.keys(this.props.data.upvotes).length
    } else {
      return 0
    }
  }

  showGallery = (e) => {   
    let arr = []
    arr.push(e.target.src)
    this.props.dispatch(actions.showGallery(arr))
  }

	render() {
    const story = this.props.data

		return (
	    	<StoryWrapper selected={ story.id === this.props.stories.active }>
	    		<StoryHeader>
					  <Avatar src={story.creator.photoURL} alt={story.creator.displayName} />
					  <UserMeta>
					    <Name>{story.creator.displayName}</Name>
					    <Meta>Just now • {story.message_count} Messages</Meta>
					  </UserMeta>
					  <UpvoteWrapper onClick={this.upvote}>
              <UpvoteLabel>&#9650;</UpvoteLabel>
					  	<UpvoteLabel>{this.getUpvoteCount()}</UpvoteLabel>
					  </UpvoteWrapper>
					</StoryHeader>
	    		<StoryBody>
	    			<Title>{story.content.title}</Title>
            
            <Desc>{story.content.description}</Desc>
            
            {story.content.media && story.content.media !== ''
              ? <Media src={story.content.media} onClick={this.showGallery} />
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
    user: state.user,
    frequencies: state.frequencies
  }
}

export default connect(mapStateToProps)(Story)
