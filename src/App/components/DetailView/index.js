import React, { Component } from 'react';
import StoryView from '../StoryView';
import ChatView from '../ChatView';
import { ViewContainer } from './style';

export default class DetailView extends Component {
	render() {
		return(
			<ViewContainer>
				<StoryView />
				<ChatView />
			</ViewContainer>
		)
	}
}