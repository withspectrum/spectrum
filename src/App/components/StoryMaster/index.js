import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Column, Header, ScrollBody, JoinBtn, LoginWrapper, LoginText, LoginButton } from './style'
import actions from '../../../actions'
import helpers from '../../../helpers'
import Story from '../Story'
import Composer from '../Composer'

class StoryMaster extends Component {
  toggleComposer = () => {
    this.props.dispatch(actions.toggleComposer())
  }

  togglePrivacy = () => {
    this.props.dispatch(actions.toggleFrequencyPrivacy())
  }

  unsubscribeFrequency = () => {
    this.props.dispatch(actions.unsubscribeFrequency())
  }

  subscribeFrequency = () => {
    this.props.dispatch(actions.subscribeFrequency())
  }

  login = (e) => {
    e.preventDefault();
    this.props.dispatch(actions.login())
  }

	render() {
    const { user, stories, frequencies } = this.props
    let usersPermissionOnFrequency = helpers.getFrequencyPermission(user, frequencies.active, frequencies.frequencies)

    let subscribeButton = (usersFrequencies, activeFrequency) => {
      let keys = Object.keys(usersFrequencies)
      
      if (usersPermissionOnFrequency === 'owner') {
        return
      } else if (!usersFrequencies && activeFrequency !== "all" && activeFrequency !== null) {
        return <JoinBtn onClick={ this.subscribeFrequency }>Join</JoinBtn>
      } else if (activeFrequency === "all" || activeFrequency === null) {
        return ''
      } else if (keys.indexOf(activeFrequency) > -1) {
        return <JoinBtn member onClick={ this.unsubscribeFrequency }>Leave</JoinBtn>
      } else if (!activeFrequency) {
        return ''
      } else {
        return <JoinBtn onClick={ this.subscribeFrequency }>Join</JoinBtn>
      }
    }

    const currentFrequency = helpers.getCurrentFrequency(frequencies.active, frequencies.frequencies)
    const currentFrequencyPrivacy = currentFrequency.settings.private


    const getPrivacyButton = (usersPermissionOnFrequency) => {
      switch (usersPermissionOnFrequency) {
        case 'owner':
          return (
            <label>Private 
              <input type="checkbox" checked={currentFrequencyPrivacy} onChange={this.togglePrivacy} />
            </label>
          )
        case 'subscriber':
          return
        default:
          return
      }
    }
    const privacyButton = getPrivacyButton(usersPermissionOnFrequency)

		return (
	    	<Column >

          { this.props.user.uid &&
            <Header>
              <img src="/img/add-story.svg" onClick={ this.toggleComposer } alt="Add Story Button"/>
              { subscribeButton(this.props.user.frequencies, this.props.frequencies.active) }
              { privacyButton }
            </Header>
          }


          <ScrollBody>
            <Composer isOpen={ this.props.composer.isOpen } />
            
            { !this.props.user.uid && /* if a user doesn't exist, show a login at the top of the story master */
              <LoginWrapper onClick={this.login}>
                <LoginText>Sign in to join the conversation.</LoginText>
                <LoginButton>Sign in with Twitter</LoginButton>
              </LoginWrapper>
            }

            { stories.stories.length > 0 &&
              // slice and reverse makes sure our stories show up in revers chron order
              stories.stories.slice(0).reverse().map((story, i) => {
                if (this.props.frequencies.active === "all") { // if we're in everything, just load the story in the sidebar
                  return (
                    <Link to={`/all/${story.id}`} key={i}>
                      <Story data={story} key={i} />
                    </Link>
                  )
                } else { // else, let's do dynamic url handling
                  return (
                    <Link to={`/${this.props.frequencies.active}/${story.id}`} key={i}>
                      <Story data={story} />
                    </Link>
                  )
                }
              }) 
            }

            { this.props.user.uid &&
              <img src="/img/add-story_secondary.svg" onClick={ this.toggleComposer } alt="Add Story Button"/>
            }
          </ScrollBody>
	    	</Column>
	  );
	}
}

const mapStateToProps = (state) => {
  return {
    stories: state.stories,
    frequencies: state.frequencies,
    composer: state.composer,
    user: state.user
  }
}

export default connect(mapStateToProps)(StoryMaster);
