import React, { Component } from 'react'
import { connect } from 'react-redux'
import ChatView from '../ChatView'
import ChatInput from '../ChatInput'
import actions from '../../../actions'
import helpers from '../../../helpers'
// eslint-disable-next-line
import { Avatar,
         AuthorName,
         Header,
         ViewContainer,
         LogicContainer,
         Media,
         StoryMeta,
         StoryTitle,
         StoryDescription,
         NullContainer,
         NullText } from './style';

class DetailView extends Component {
  getActiveStory = () => {
    if (this.props.stories.stories){
      return this.props.stories.stories.filter((story) => {
        return story.id === this.props.stories.active;
      })[0] || ''
    } else {
      return
    }
  }

  deleteStory = () => {
    const story = this.getActiveStory()
    this.props.dispatch(actions.deleteStory(story.id))
  }

  toggleLockedStory = () => {
    const story = this.getActiveStory()
    this.props.dispatch(actions.toggleLockedStory(story))
  }

  showGallery = (e) => {
    let arr = []
    arr.push(e.target.src)
    this.props.dispatch(actions.showGallery(arr))
  }

	render() {	
    const story = this.getActiveStory()
    let moderator, creator, locked
    if (story) {
      creator = helpers.isStoryCreator(story, this.props.user)
      moderator = helpers.getStoryPermission(story, this.props.user, this.props.frequencies)
      locked = story.locked ? story.locked : false
    }

		return(
			<ViewContainer>
				{ story
					? <LogicContainer>
							<Header>
								<StoryMeta>
                {story.creator.photoURL ? <Avatar src={story.creator.photoURL} />: ""}
                  <StoryTitle>{story.content.title}</StoryTitle>
                  <AuthorName>{story.creator.displayName}</AuthorName>
                </StoryMeta>
								<StoryDescription>{story.content.description}</StoryDescription>
                {story.content.media && story.content.media !== ''
                  ? <Media onClick={this.showGallery} src={story.content.media} />
                  : ''
                }

                { creator || moderator === "owner" // if the story was created by the current user, or is in a frequency the current user owns
                  ? <div>
                      <button onClick={this.deleteStory}>Delete Story</button> · 
                      <label>Lock Conversation is {`${locked}`}
                        <input type="checkbox" onChange={this.toggleLockedStory} checked={locked} />
                      </label>
                    </div>
                  : ''
                }
							</Header>
							
							<ChatView />
							{!story.locked &&
                <ChatInput />
              }
						</LogicContainer>
					: <NullContainer>
							<NullText>Choose a story to get started!</NullText>
						</NullContainer>
				}
			</ViewContainer>
		)
	}
}

const mapStateToProps = (state) => ({
  stories: state.stories,
  frequencies: state.frequencies,
  user: state.user
})

export default connect(mapStateToProps)(DetailView);
