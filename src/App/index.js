import React, { Component } from 'react'
import { connect } from 'react-redux'
import NavBar from './components/NavBar'
import { Body } from './style'
import StoryMaster from './components/StoryMaster'
import DetailView from './components/DetailView'
import { setUser } from '../actions/user'
import { setActiveStory } from '../actions/stories'
import { setFrequencies, setActiveFrequency } from '../actions/frequencies'

class App extends Component {
	componentDidMount() {
    const activeFrequencyParam = this.props.params.frequency || "all"
    const activeStoryParam = this.props.params.story || ""
    
    this.props.dispatch(setUser()) // on first load, set the user
    this.props.dispatch(setFrequencies()) // on first load, get frequences from the server
    
    this.props.dispatch(setActiveFrequency(activeFrequencyParam))
    if (activeStoryParam) { this.props.dispatch(setActiveStory(activeStoryParam)) }
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