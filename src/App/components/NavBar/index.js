import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import actions from '../../../actions'
import helpers from '../../../helpers'
import { Column, Header, HeaderLogo, Avatar, MetaWrapper, Name, MetaLink, FreqList, FreqListHeading, Freq, FreqLabel, FreqIcon, FreqGlyph, Footer, FooterLogo, FooterMeta, Form, Input, Button } from './style';

class NavBar extends Component{
  constructor() {
    super()

    this.state = {
      frequencyName: ''
    }
  }

  login = (e) => {
    e.preventDefault();
    this.props.dispatch(actions.login())
  }

  signOut = (e) => {
    e.preventDefault();
    this.props.dispatch(actions.signOut())
  }

  goPro = () => {
    this.props.dispatch(actions.showProModal())
  }

  updateFrequencyName = (e) => {
    this.setState({
      frequencyName: e.target.value
    })
  }

  setActiveFrequency = (e) => {
    this.props.dispatch(actions.setActiveFrequency(e.target.id))
    this.props.dispatch(actions.setStories())
  }

  addFrequency = (e) => {
    e.preventDefault()
    this.props.dispatch(actions.addFrequency(this.state.frequencyName))
    this.setState({
      frequencyName: ''
    })
  }

  render() {
    const frequencies = this.props.frequencies.frequencies
    const activeFrequency = this.props.frequencies.active
    const user = this.props.user
    const myFrequencies = helpers.getMyFrequencies(frequencies, user)
    const publicFrequencies = helpers.getPublicFrequencies(frequencies, user)

    return(
      <Column>
        { this.props.user.uid
          ? 
            <Header>
              <Avatar src={this.props.user.photoURL} title="Bryn Jackson" />
              <MetaWrapper>
                <Name>{this.props.user.displayName}</Name> 
                <MetaLink onClick={this.goPro}>Upgrade to Pro</MetaLink>                  
                <MetaLink onClick={this.signOut}>Sign Out</MetaLink>                  
              </MetaWrapper>
            </Header>
          : 
            <Header login>
              <HeaderLogo src="/img/logo.png" role="presentation"/>
            </Header>
        }
        <FreqList>
          <FreqListHeading>My Frequencies</FreqListHeading>
          
          <Link to="/">
            <Freq active={this.props.frequencies.active === 'all'}>
              <FreqIcon src="/img/everything-icon.svg"/>
              <FreqLabel>Everything</FreqLabel>
            </Freq>
          </Link>

          { myFrequencies &&
            myFrequencies.map((frequency, i) => {                
              return (
                <Link to={`/${frequency.id}`} key={i}>
                  <Freq 
                    active={frequency.id === activeFrequency}>
                    <FreqGlyph>~</FreqGlyph>
                    <FreqLabel>{ frequency.name }</FreqLabel>
                  </Freq>
                </Link>
              )
            })
          }
          
          <FreqListHeading style={{marginTop:"16px"}}>Other Frequencies</FreqListHeading>
          { publicFrequencies &&
            publicFrequencies.map((frequency, i) => {
              return (
                <Link to={`/${frequency.id}`} key={i}>
                  <Freq 
                    key={i} 
                    onClick={this.setActiveFrequency} 
                    id={frequency.id}
                    active={frequency.id === activeFrequency}>
                    <FreqGlyph>~</FreqGlyph>
                    <FreqLabel>{ frequency.name }</FreqLabel>
                  </Freq>
                </Link>
              )
            })
          }
        </FreqList>
        <Form onSubmit={this.addFrequency}>
          <Input type="text" onChange={this.updateFrequencyName} value={this.state.frequencyName} placeholder="+ Create a Frequency" />            
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
      </Column>
    )
  }
};

const mapStateToProps = (state) => ({
  user: state.user,
  frequencies: state.frequencies
})

export default connect(mapStateToProps)(NavBar);
