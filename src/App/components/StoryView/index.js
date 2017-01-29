import React, { Component } from 'react';
import { StoryWrapper, StoryP, StorySectionLabel, StoryStatic, StoryText, StoryImgList, StoryImg, StoryTagList, StoryTag } from './style';

export default class StoryView extends Component {
	render() {
		return(
			<StoryWrapper>
				<StoryText>
					<StoryP>Yo. This is a paragraph inside the StoryDetail View. This is just a place to put a bunch of context about a set of images or maybe ask a question or voice an opinion or something.</StoryP>
					<StoryP>Testing overflow...Testing overflow...Testing overflow...Testing overflow...Testing overflow...Testing overflow...Testing overflow...Testing overflow...Testing overflow...Testing overflow...Testing overflow...Testing overflow...Testing overflow...Testing overflow...Testing overflow...Testing overflow...Testing overflow...Testing overflow...</StoryP>
					<StoryP>We really don't want to be prescriptive about how people use it... 😁</StoryP>
				</StoryText>
				<StoryStatic>
					<StorySectionLabel>Images</StorySectionLabel>
					<StoryImgList>
						<StoryImg src="/img/media.png" align="middle"/>
						<StoryImg src="/img/media.png" align="middle"/>
						<StoryImg src="/img/media.png" align="middle"/>
						<StoryImg src="/img/media.png" align="middle"/>
						<StoryImg src="/img/media.png" align="middle"/>
						<StoryImg src="/img/media.png" align="middle"/>
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