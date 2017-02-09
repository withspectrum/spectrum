import React, { Component } from 'react';
import { StoryWrapper, StoryP, StorySectionLabel, StoryStatic, StoryText, StoryImgList, StoryImg, StoryTagList, StoryTag } from './style';

export default class StoryView extends Component {
	render() {
		return(
			<StoryWrapper>
				<StoryMeta>
				  <AuthorName>{this.state.activeStory.creator.displayName}</AuthorName>
				</StoryMeta>
				<StoryDescription>{this.state.activeStory.content.description}</StoryDescription>
				<StoryStatic>
					<StorySectionLabel>Images</StorySectionLabel>
					<StoryImgList>
						{this.state.activeStory.content.media && this.state.activeStory.content.media !== ''
						  ? <a href={this.state.activeStory.content.media} target="_blank"><Media src={this.state.activeStory.content.media} /></a>
						  : ''
						}
					</StoryImgList>
					<StorySectionLabel>Tags</StorySectionLabel>
					<StoryTagList>
						<StoryTag>Design</StoryTag>
						<StoryTag>iOS</StoryTag>
						<StoryTag>Show n Tell</StoryTag>
					</StoryTagList>
				</StoryStatic>
			</StoryWrapper>
		)
	}
}