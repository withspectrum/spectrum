import React, { Component } from 'react';
import { connect } from 'react-redux'
import StoryView from '../StoryView';
import ChatView from '../ChatView';
import ChatInput from '../ChatInput';
// eslint-disable-next-line
import {  Header,
          ViewContainer,
          LogicContainer,
          StoryTitle,
          NullContainer,
          NullText } from './style';

class DetailView extends Component {
  constructor(props){
    super(props)
    this.state = {
      activeStory: {
        id: 0
      }
    }
  }
  getActiveStory(){
    var that = this;
    let nullStory = Object.create({ content: { title: "Choose a story." }, creator: {}, id: 0 })
    if (this.props.stories.stories){
      return this.props.stories.stories.filter(function(story){
       return story.id === that.props.stories.active;
      })[0] || nullStory 
    } else {
      return nullStory
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
				{ this.state.activeStory
					? 
            <LogicContainer>
							<Header> 
                <StoryTitle> {this.state.activeStory.content.title} </StoryTitle> 
              </Header>
							<StoryView activeStory={this.state.activeStory}/>
							<ChatView />
							<ChatInput />
						</LogicContainer>
					: 
            <NullContainer>
							<NullText>Choose a story to get started!</NullText>
						</NullContainer>
				}
			</ViewContainer>
		)
	}
}

const mapStateToProps = (state) => ({
  stories: state.stories,
  frequencies: state.frequencies
})

export default connect(mapStateToProps)(DetailView);
