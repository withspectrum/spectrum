import React, { Component } from 'react';
import { connect } from 'react-redux'
import { setStories } from '../../../actions/stories'
import { Column, Header, ScrollBody, Button } from './style';
import Story from '../Story';
import Composer from '../Composer';

class StoryMaster extends Component{
  constructor() {
    super()

    this.state = {
      composerIsOpen: false
    }
  }

  toggleComposer = () => {
    this.setState({
      composerIsOpen: !this.state.composerIsOpen
    })
  }

	render() {
    let stories = this.props.stories.stories

		return (
	    	<Column >

          <Header>
            <Button onClick={ this.toggleComposer }> + </Button>
          </Header>

          <Composer isOpen={this.state.composerIsOpen} />

          <ScrollBody>
            { stories.length > 0 &&
              // slice and reverse makes sure our stories show up in revers chron order
              stories.slice(0).reverse().map((story, i) => {
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
    stories: state.stories,
    frequencies: state.frequencies
  }
}

export default connect(mapStateToProps)(StoryMaster);