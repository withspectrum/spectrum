import React, { Component } from 'react'
import { connect } from 'react-redux'
import NavBar from './components/NavBar'
import { Body } from './style'
import StoryMaster from './components/StoryMaster'
import DetailView from './components/DetailView'
import { setUser } from '../actions/user'
import { setActiveStory, setStories } from '../actions/stories'
import { setFrequencies, setActiveFrequency } from '../actions/frequencies'
import { setMessages } from '../actions/messages'

class App extends Component {
	componentDidMount() {
    const activeFrequencyParam = this.props.params.frequency || "all"
    const activeStoryParam = this.props.params.story || ""
    
    this.props.dispatch(setUser()) // on first load, set the user
    this.props.dispatch(setFrequencies()) // on first load, get frequences from the server
    this.props.dispatch(setStories())
    this.props.dispatch(setActiveFrequency(activeFrequencyParam))
    if (activeStoryParam) { this.props.dispatch(setActiveStory(activeStoryParam)) }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.params.frequency !== this.props.params.frequency) {
      this.props.dispatch(setActiveFrequency(nextProps.params.frequency))
      this.props.dispatch(setStories())
    }

    if (nextProps.params.story !== this.props.params.frequency) {
      this.props.dispatch(setActiveStory(this.props.params.story))
      this.props.dispatch(setMessages(this.props.params.story))
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