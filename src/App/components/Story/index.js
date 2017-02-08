import React, { Component } from 'react';
import { connect } from 'react-redux'
// eslint-disable-next-line
import { StoryWrapper, StoryBody, StoryHeader, Avatar, UserMeta, Name, Meta, UpvoteWrapper, UpvoteLabel, Title, Desc, Media } from './style';
import actions from '../../../actions'
import helpers from '../../../helpers'

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

	render() {
    const creator = helpers.isStoryCreator(this.props.data, this.props.user)
    const moderator = helpers.getStoryPermission(this.props.data, this.props.user, this.props.frequencies)
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
            { creator &&
              <p>I made dis</p>
            }

            { moderator &&
              <p>mod role: {moderator}</p>
            }
	    			<Title>{story.content.title}</Title>
            
            <Desc>{story.content.description}</Desc>
            
            {story.content.media && story.content.media !== ''
              ? <Media src={story.content.media} />
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
