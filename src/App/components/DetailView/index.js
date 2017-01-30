import React, { Component } from 'react';
// import StoryView from '../StoryView';
import ChatView from '../ChatView';
import ChatInput from '../ChatInput';
import { Header, ViewContainer, StoryTitle } from './style';

export default class DetailView extends Component {
	render() {
		return(
			<ViewContainer>
				<Header>
					<StoryTitle>This is a story title</StoryTitle>
				</Header>
				
				<ChatInput />
				<ChatView />
			</ViewContainer>
		)
	}
}