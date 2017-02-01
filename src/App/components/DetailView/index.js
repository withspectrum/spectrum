import React, { Component } from 'react';
import { connect } from 'react-redux'
// import StoryView from '../StoryView';
import ChatView from '../ChatView';
import ChatInput from '../ChatInput';
// eslint-disable-next-line
import { Header, ViewContainer, LogicContainer, StoryTitle, NullContainer, NullText } from './style';

class DetailView extends Component {
	render() {
		return(
			<ViewContainer>
				{ this.props.stories.active !== null
					? <LogicContainer>
							<Header>
								<StoryTitle>Title</StoryTitle>
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
  stories: state.stories
})

export default connect(mapStateToProps)(DetailView);