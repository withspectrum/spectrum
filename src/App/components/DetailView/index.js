import React, { Component } from 'react';
import { connect } from 'react-redux'
// import StoryView from '../StoryView';
import ChatView from '../ChatView';
import ChatInput from '../ChatInput';
// eslint-disable-next-line
import { Header, ViewContainer, LogicContainer, StoryTitle, StoryDescription, NullContainer, NullText } from './style';

class DetailView extends Component {
  getActiveStory(){
    var that = this;
    if (this.props.stories.stories){
      return this.props.stories.stories.filter(function(story){
       return story.id == that.props.stories.active;
      })[0];
    } else {
      return { content: { title: "Choose a story." } }
    }
  }
	render() {
		return(
			<ViewContainer>
				{ this.props.stories.active !== null
					? <LogicContainer>
							<Header>
								<StoryTitle>{this.getActiveStory().content.title}</StoryTitle>
								<StoryDescription>{this.getActiveStory().content.description}</StoryDescription>
							</Header>
							
							<ChatView />
							<ChatInput />
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
  activeStory: state.active
})

export default connect(mapStateToProps)(DetailView);
