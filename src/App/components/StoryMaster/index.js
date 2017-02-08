import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Column, Header, ScrollBody, JoinBtn, LoginWrapper, LoginText, LoginButton } from './style'
import { toggleComposer } from '../../../actions/composer'
import { login } from '../../../actions/user'
import { unsubscribeFrequency, subscribeFrequency } from '../../../actions/frequencies'
import Story from '../Story'
import Composer from '../Composer'

class StoryMaster extends Component{
  toggleComposer = () => {
    this.props.dispatch(toggleComposer())
  }

  unsubscribeFrequency = () => {
    this.props.dispatch(unsubscribeFrequency())
  }

  subscribeFrequency = () => {
    this.props.dispatch(subscribeFrequency())
  }

  login = (e) => {
    e.preventDefault();
    this.props.dispatch(login())
  }

	render() {
    let stories = this.props.stories.stories
    let subscribeButton = (usersFrequencies, activeFrequency) => {
      let keys = Object.keys(usersFrequencies)
      
      if (!usersFrequencies && activeFrequency !== "all" && activeFrequency !== null) {
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

		return (
	    	<Column >

          { this.props.user.uid &&
            <Header>
              <img src="/img/add-story.svg" onClick={ this.toggleComposer } alt="Add Story Button"/>
              { subscribeButton(this.props.user.frequencies, this.props.frequencies.active) }
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

            { stories.length > 0 &&
              // slice and reverse makes sure our stories show up in revers chron order
              stories.slice(0).reverse().map((story, i) => {
                if (this.props.frequencies.active === "all") { // if we're in everything, just load the story in the sidebar
                  return <Story data={story} key={i} />
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
