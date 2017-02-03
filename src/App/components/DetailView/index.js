import React, { Component } from 'react';
import { connect } from 'react-redux'
// import StoryView from '../StoryView';
import ChatView from '../ChatView';
import ChatInput from '../ChatInput';
// eslint-disable-next-line
import { Avatar,
         AuthorName,
         Header,
         ViewContainer,
         LogicContainer,
         Media,
         StoryMeta,
         StoryTitle,
         StoryDescription,
         NullContainer,
         NullText } from './style';

class DetailView extends Component {
  constructor(props){
    super(props)
    this.state = {
      activeStory: null
    }

  }
  getActiveStory(){
    var that = this;
    if (this.props.stories.stories){
      return this.props.stories.stories.filter(function(story){
       return story.id === that.props.stories.active;
      })[0];
    } else {
      return { content: { title: "Choose a story." } }
    }
  }
  componentDidUpdate() {
    if (this.state.activeStory.id !== this.getActiveStory().id){
      this.setState({
        activeStory: this.getActiveStory()
      })
    }
  }
  componentWillMount() {
    this.setState({
      activeStory: this.getActiveStory()
    })
  }
	render() {		
		return(
			<ViewContainer>
				{ this.state.activeStory !== null
					? <LogicContainer>
							<Header>
								<StoryMeta>
                  <Avatar src={this.state.activeStory.creator.photoURL} />
                  <StoryTitle>{this.state.activeStory.content.title}</StoryTitle>
                  <AuthorName>{this.state.activeStory.creator.displayName}</AuthorName>
                </StoryMeta>
								<StoryDescription>{this.state.activeStory.content.description}</StoryDescription>
                {this.state.activeStory.content.media && this.state.activeStory.content.media !== ''
                  ? <a href={this.state.activeStory.content.media} target="_blank"><Media src={this.state.activeStory.content.media} /></a>
                  : ''
                }
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
