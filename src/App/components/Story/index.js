import React, { Component } from 'react';
import { connect } from 'react-redux'
// eslint-disable-next-line
import { StoryWrapper, StoryBody, StoryHeader, Avatar, UserMeta, Name, Meta, Title, Media } from './style';
import actions from '../../../actions'

class Story extends Component{

  showGallery = (e) => {   
    let arr = []
    arr.push(e.target.src)
    this.props.dispatch(actions.showGallery(arr))
  }

	render() {
    const story     = this.props.data
    const timestamp = story.timestamp
    let currentTime = Date.now()

    function timeDifference(current, previous) {

      const msPerMinute = 60 * 1000;
      const msPerHour = msPerMinute * 60;
      const msPerDay = msPerHour * 24;
      const msPerMonth = msPerDay * 30;
      const msPerYear = msPerDay * 365;

      let elapsed = current - previous;

      if (elapsed < msPerMinute) {
        return 'Just now';   
      }

      else if (elapsed < msPerHour) {
        const now = Math.round(elapsed/msPerMinute)
        if (now === 1) {
          return `1 minute ago`
        }else{
          return `${now} minutes ago`   
        }
      }

      else if (elapsed < msPerDay ) {
        const now = Math.round(elapsed/msPerHour)
        if (now === 1) {
          return `1 hour ago`
        }else{
          return `${now} hours ago`;
        }   
      }

      else if (elapsed < msPerMonth) {
        const now = Math.round(elapsed/msPerDay) 
        if (now === 1) {
          return `1 day ago`
        }else{
          return `${now} days ago`;
        }  
      }

      else if (elapsed < msPerYear) {
        const now = Math.round(elapsed/msPerMonth)
        if (now === 1) {
          return `1 month ago`
        }else{
          return `${now} months ago`;
        }   
      }

      else {
        const now = Math.round(elapsed/msPerYear )
        if (now === 1) {
          return `1 year ago`
        }else{
          return `${now} years ago`;
        }   
      }
    }

    const story = this.props.data

		return (
	    	<StoryWrapper selected={ story.id === this.props.stories.active }>
	    		<StoryHeader>
					  <Avatar src={story.creator.photoURL} alt={story.creator.displayName} />
					  <UserMeta>
					    <Name>{story.creator.displayName}</Name>
					    <Meta>{timeDifference(currentTime, timestamp)} • {story.message_count > 0 ? `${story.message_count} messages` : 'No messages yet'}</Meta>
					  </UserMeta>
					</StoryHeader>
	    		<StoryBody>

	    			<Title>{story.content.title}</Title>
            
            {story.content.media && story.content.media !== ''
              ? <Media src={story.content.media} onClick={this.showGallery} />
              : ''
            }
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
