import React, { Component } from 'react'
import { connect } from 'react-redux' 
import { Lock, Unlock, Delete } from '../../../shared/Icons'
import {  Wrapper,
					Description, 
					Media,
					Button,
					HiddenInput} from './style';
import actions from '../../../actions'

class StoryView extends Component {
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

	render() {
		const story = this.props.activeStory
		const creator = this.props.creator
		const moderator = this.props.moderator
		const locked = this.props.locked


		return(
			<Wrapper>
				<Description>{story.content.description}</Description>
					{story.content.media && story.content.media !== ''
						?
							<a href={story.content.media} target="_blank"><Media src={story.content.media} /></a>
					  : 
						  ''
					}
					{ creator || moderator === "owner" // if the story was created by the current user, or is in a frequency the current user owns
            ? <div>
                <Button onClick={this.deleteStory} tooltip={'Delete Story'}><Delete /></Button>
                <label>
                	{locked ?
                		<Lock tooltip={'Unlock Story'}/>
                	:
                		<Unlock tooltip={'Lock Story'}/>
                	}
                  <HiddenInput type="checkbox" onChange={this.toggleLockedStory} checked={locked} />
                </label>
              </div>
            : ''
          }
			</Wrapper>
		)
	}
}

const mapStateToProps = (state) => ({
  stories: state.stories,
  frequencies: state.frequencies,
  user: state.user
})

export default connect(mapStateToProps)(StoryView);