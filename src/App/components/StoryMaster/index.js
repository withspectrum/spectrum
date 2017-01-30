import React, { Component } from 'react';
import { connect } from 'react-redux'
import { setStories, createStory } from '../../../actions/stories'
import { Column, Header, ScrollBody, Button } from './style';
import Story from '../Story';

class StoryMaster extends Component{
  constructor(){
    super();
    this.state = {
      newStoryContent: ""
    }
  }

  componentWillMount(){
    this.props.dispatch(setStories(this.props.frequencies.active))
  }

  changeNewStoryContent = (e) => {
    this.setState({
      newStoryContent: e.target.value
    });
  }

  createStory = (e) => {
    e.preventDefault();
    this.props.dispatch(createStory(this.state.newStoryContent))
    this.setState({
      newStoryContent: ""
    })
  }

	render() {

    /**
      Firebase returns stories as a bunch of nested objects. In order to have better control over
      iterative rendering (i.e. using .map()) we need to get these stories into an array.
    */
    let stories = this.props.stories.stories
    let storiesToRender = []
    for (let key in stories) {
      if (!stories.hasOwnProperty(key)) continue;

      let arr = stories[key];
      storiesToRender.push(arr)
    }

		return (
	    	<Column>

          <Header>
            <Button> + </Button>
          </Header>

          { this.props.frequencies.active && 
            <form style={{paddingTop: "100px"}} onSubmit={ this.createStory }>
              <input value={this.state.newStoryContent} onChange={this.changeNewStoryContent} />
              <input type="submit" />
            </form>     
          }     
          <ScrollBody>
            { storiesToRender.length > 0 &&
              // slice and reverse makes sure our stories show up in revers chron order
              storiesToRender.slice(0).reverse().map((story, i) => {
                return <Story data={story} key={i} />
              }) 
            }
          </ScrollBody>
	    	</Column>
	  );
	}
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    stories: state.stories,
    frequencies: state.frequencies
  }
}

export default connect(mapStateToProps)(StoryMaster);