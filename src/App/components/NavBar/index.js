import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addFrequency, setActiveFrequency } from '../../../actions/frequencies'
import { setStories } from '../../../actions/stories'
import { signOut, login } from '../../../actions/user'
import { Column, Avatar, Header, MetaWrapper, Form, Input, Button, Name, MetaLink, FreqList, FreqActive, Freq, FreqLabel, FreqIcon, Footer, FooterLogo, FooterMeta } from './style';
import { AvatarMask } from './svg';

class NavBar extends Component{
  constructor() {
    super()

    this.state = {
      frequencyName: ''
    }
  }

  login = (e) => {
    e.preventDefault();
    this.props.dispatch(login())
  }

  signOut = (e) => {
    e.preventDefault();
    this.props.dispatch(signOut())
  }

  updateFrequencyName = (e) => {
    this.setState({
      frequencyName: e.target.value
    })
  }

  setActiveFrequency = (e) => {
    this.props.dispatch(setActiveFrequency(e.target.id))
    this.props.dispatch(setStories())
  }

  addFrequency = (e) => {
    e.preventDefault()
    this.props.dispatch(addFrequency(this.state.frequencyName))
    this.setState({
      frequencyName: ''
    })
  }

  render() {

    /**
      Firebase returns frequencies as a bunch of nested objects. In order to have better control over
      iterative rendering (i.e. using .map()) we need to get these frequencies into an array.
    */
    const frequencies = this.props.frequencies.frequencies

    return(
      <Column>
        <div>
          <AvatarMask />
          { this.props.user.uid
            ? 
              <Header>
                <Avatar src={this.props.user.photoURL} title="Bryn Jackson" />
                <MetaWrapper>
                  <Name>{this.props.user.displayName}</Name> 
                  <MetaLink onClick={this.signOut}>Sign Out</MetaLink>
                </MetaWrapper>
              </Header>
            : 
              <button onClick={this.login}>log in with twitter</button>
          }
          <FreqList>
            { frequencies.length > 0 &&
              frequencies.map((frequency, i) => {
                if (frequency.id === this.props.frequencies.active) {
                  return <FreqActive key={i} onClick={this.setActiveFrequency} id={frequency.id}>
                          <FreqIcon src="/img/freq-icon.svg"/>
                          <FreqLabel>{ frequency.name }</FreqLabel>
                          </FreqActive>
                } else {
                  return <Freq key={i} onClick={this.setActiveFrequency} id={frequency.id}>
                          <FreqIcon src="/img/freq-icon.svg"/>
                          <FreqLabel>{ frequency.name }</FreqLabel>
                          </Freq>
                }
              }) 
            }
          </FreqList>
        </div>

        <div>
          <Form onSubmit={this.addFrequency}>
            <Input type="text" onChange={this.updateFrequencyName} value={this.state.frequencyName} placeholder="New Frequency" />            
            <Button type="submit">~</Button>
          </Form>
          
          <Footer>
            <FooterLogo src="/img/mark.svg" />
            <MetaWrapper>
              <FooterMeta>© 2017 Spec Network, Inc.</FooterMeta>
              <FooterMeta>
                <MetaLink href="https://spec.fm/about"> About</MetaLink>&nbsp;·&nbsp;<MetaLink href="mailto:spectrum@spec.fm">Contact</MetaLink>
              </FooterMeta>
            </MetaWrapper>
          </Footer>
        </div>

      </Column>
    )
  }
};

const mapStateToProps = (state) => ({
  user: state.user,
  frequencies: state.frequencies
})

export default connect(mapStateToProps)(NavBar);