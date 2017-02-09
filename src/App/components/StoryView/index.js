import React, { Component } from 'react';
import {  StoryWrapper, 
					StorySectionLabel, 
					StoryStatic, 
					StoryMeta, 
					AuthorName, 
					StoryDescription, 
					Media, 
					StoryImgList} from './style';

export default class StoryView extends Component {
	render() {
		return(
			<StoryWrapper>
				<StoryMeta>
				  <AuthorName>{this.props.activeStory.creator.displayName}</AuthorName>
				</StoryMeta>
				<StoryDescription>{this.props.activeStory.content.description}</StoryDescription>
					{this.props.activeStory.content.media && this.props.activeStory.content.media !== ''
						?
							<StoryStatic>
								<StorySectionLabel>Images</StorySectionLabel>
								<StoryImgList>
									<a href={this.props.activeStory.content.media} target="_blank"><Media src={this.props.activeStory.content.media} /></a>
							  </StoryImgList>
						  </StoryStatic>
					  : 
						  ''
					}
				<StoryStatic>
					<StorySectionLabel>Tags</StorySectionLabel>
					{/*<StoryTagList>
						<StoryTag>design</StoryTag>
						<StoryTag>ios</StoryTag>
						<StoryTag>show-n-tell</StoryTag>
					</StoryTagList>*/}
				</StoryStatic>
			</StoryWrapper>
		)
	}
}