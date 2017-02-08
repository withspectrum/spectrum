import React, { Component } from 'react'
import { connect } from 'react-redux'
import NavBar from './components/NavBar'
import { Body } from './style'
import StoryMaster from './components/StoryMaster'
import DetailView from './components/DetailView'
import actions from '../actions'

class App extends Component {
	componentDidMount() {
    const { dispatch, params } = this.props

    const activeFrequencyParam = params.frequency || "all"
    const activeStoryParam = params.story || ""
    
    dispatch(actions.setActiveFrequency(activeFrequencyParam))
    dispatch(actions.setStories())
    if (activeStoryParam) { dispatch(actions.setActiveStory(activeStoryParam)) }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true
  }

  componentWillUpdate(nextProps, nextState) {
    const { dispatch, params } = this.props

    if (nextProps.params.frequency !== params.frequency) {
      dispatch(actions.setActiveFrequency(nextProps.params.frequency))
      dispatch(actions.setStories())
    }

    if (nextProps.params.story !== params.frequency) {
      dispatch(actions.setActiveStory(nextProps.params.story))
      dispatch(actions.setMessages())
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