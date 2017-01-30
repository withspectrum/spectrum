import React, { Component } from 'react';
import { connect } from 'react-redux'
// import StoryView from '../StoryView';
import ChatView from '../ChatView';
import ChatInput from '../ChatInput';
import { Header, ViewContainer, StoryTitle, NullContainer, NullText } from './style';

class DetailView extends Component {
	render() {
		return(
			<ViewContainer>
				{ this.props.stories.active !== null
					? <div>
							<Header>
								<StoryTitle>Title</StoryTitle>
							</Header>
							
							<ChatInput />
							<ChatView />
						</div>
					: <NullContainer>
							<NullText>Choose a story to get started!</NullText>
						</NullContainer>
				}
			</ViewContainer>
		)
	}
}

const mapStateToProps = (state) => ({
  stories: state.stories
})

export default connect(mapStateToProps)(DetailView);