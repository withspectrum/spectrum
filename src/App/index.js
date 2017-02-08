import React, { Component } from 'react'
import { connect } from 'react-redux'
import NavBar from './components/NavBar'
import { Body } from './style'
import StoryMaster from './components/StoryMaster'
import DetailView from './components/DetailView'
import actions from '../actions'

class App extends Component {
	componentDidMount() {
    const activeFrequencyParam = this.props.params.frequency || "all"
    const activeStoryParam = this.props.params.story || ""
    
    this.props.dispatch(actions.setFrequencies()) // on first load, get frequences from the server
    this.props.dispatch(actions.setStories())
    this.props.dispatch(actions.setActiveFrequency(activeFrequencyParam))
    if (activeStoryParam) { this.props.dispatch(actions.setActiveStory(activeStoryParam)) }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.params.frequency !== this.props.params.frequency) {
      this.props.dispatch(actions.setActiveFrequency(nextProps.params.frequency))
      this.props.dispatch(actions.setStories())
    }

    if (nextProps.params.story !== this.props.params.frequency) {
      this.props.dispatch(actions.setActiveStory(this.props.params.story))
      this.props.dispatch(actions.setMessages(this.props.params.story))
    }
  }

  render() {
    return(
      <Body>
        <NavBar />
				<StoryMaster />
				<DetailView />
      </Body>
    )
  }
}

export default connect()(App)