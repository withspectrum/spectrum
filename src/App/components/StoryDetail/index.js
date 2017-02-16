import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import ChatDetail from '../ChatDetail' 
import { Lock, Unlock, Delete } from '../../../shared/Icons'
import {  ScrollBody,
          ContentView,
          Header,
          StoryTitle,
          FlexColumn,
          FlexColumnEnd,
          Byline,
					TextBody, 
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

  componentWillUpdate() {
    var node = ReactDOM.findDOMNode(this);
    this.shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight || node.scrollTop === 0;
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
			<ScrollBody>
        <ContentView>
          <Header>
            <FlexColumn>
              <Byline>{story.creator.displayName}</Byline>
              <StoryTitle>{story.content.title}</StoryTitle>
            </FlexColumn>
              { creator || moderator === "owner" // if the story was created by the current user, or is in a frequency the current user owns
                ? <FlexColumnEnd>
                    <label>
                      {locked ?
                        <Lock color='warn' stayActive tooltip={'Unlock Story'}/>
                      :
                        <Unlock tooltip={'Lock Story'}/>
                      }
                      <HiddenInput type="checkbox" onChange={this.toggleLockedStory} checked={locked} />
                    </label>
                    <Button onClick={this.deleteStory} tooltip={'Delete Story'}><Delete color='warn' /></Button>
                  </FlexColumnEnd>
                : ''
              }
          </Header>
  				<TextBody>{story.content.description}</TextBody>
  					{story.content.media && story.content.media !== ''
  						?
  							<Media src={story.content.media} onClick={this.showGallery} />
  					  : 
  						  ''
  					}
        </ContentView>
        <ChatDetail />
			</ScrollBody>
		)
	}
}

const mapStateToProps = (state) => ({
  stories: state.stories,
  frequencies: state.frequencies,
  user: state.user
})

export default connect(mapStateToProps)(StoryView);