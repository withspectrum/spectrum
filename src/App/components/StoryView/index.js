import React, { Component } from 'react';
import {  Wrapper, 
					SectionLabel, 
					Section, 
					Meta, 
					AuthorName, 
					Description, 
					Media, 
					RowList} from './style';

export default class StoryView extends Component {
	render() {
		const story = this.props.activeStory
		const creator = this.props.creator
		const moderator = this.props.moderator
		const locked = this.props.locked
		return(
			<Wrapper>
				<Meta>
				  <AuthorName>{story.creator.displayName}</AuthorName>
				</Meta>
				<Description>{story.content.description}</Description>
					{story.content.media && story.content.media !== ''
						?
							<Section>
								<SectionLabel>Images</SectionLabel>
								<RowList>
									<a href={story.content.media} target="_blank"><Media src={story.content.media} /></a>
							  </RowList>
						  </Section>
					  : 
						  ''
					}
					{ creator || moderator === "owner" // if the story was created by the current user, or is in a frequency the current user owns
            ? <div>
                <button onClick={this.deleteStory}>Delete Story</button>
                <label>{`${locked}`}
                  <input type="checkbox" onChange={this.toggleLockedStory} checked={locked} />
                </label>
              </div>
            : ''
          }
				{/*<StoryStatic>
					<StorySectionLabel>Tags</StorySectionLabel>
					<StoryTagList>
						<StoryTag>design</StoryTag>
						<StoryTag>ios</StoryTag>
						<StoryTag>show-n-tell</StoryTag>
					</StoryTagList>
				</StoryStatic>*/}
			</Wrapper>
		)
	}
}