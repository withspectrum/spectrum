import React, { Component } from 'react'
import { connect } from 'react-redux'
import NavBar from './components/NavBar'
import { Body } from './style'
import StoryMaster from './components/StoryMaster'
import DetailView from './components/DetailView'
import { setUser } from '../actions/user'
import { setFrequencies } from '../actions/frequencies'

class App extends Component {
	constructor(props) {
    super(props)
    props.dispatch(setUser()) // on first load, set the user
    props.dispatch(setFrequencies()) // on first load, get frequences from the server
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