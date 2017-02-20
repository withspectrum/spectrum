import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {
  login,
  signOut
} from '../../../actions/user';
import {
  showModal
} from '../../../actions/modals';
import {
  setActiveFrequency,
  addFrequency
} from '../../../actions/frequencies';
import {
  Column,
  Header,
  HeaderLogo,
  Avatar,
  MetaWrapper,
  P,
  Name,
  MetaLink,
  FreqList,
  FreqListHeading,
  Freq,
  FreqLabel,
  FreqIcon,
  FreqGlyph,
  Footer,
  FooterLogo,
  FooterP,
  Form,
  Input,
  Button,
} from './style';

class NavigationMaster extends Component {
  constructor() {
    super();

    this.state = {
      frequencyName: '',
    };
  }

  login = e => {
    e.preventDefault();
    this.props.dispatch(login());
  };

  signOut = e => {
    e.preventDefault();
    this.props.dispatch(signOut());
  };

  goPro = () => {
    this.props.dispatch(showModal('PRO_MODAL'));
  };

  updateFrequencyName = e => {
    this.setState({
      frequencyName: e.target.value,
    });
  };

  setActiveFrequency = e => {
    this.props.dispatch(setActiveFrequency(e.target.id));
  };

  addFrequency = e => {
    e.preventDefault();
    const frequencyName = this.state.frequencyName.trim();
    if (frequencyName === '') return;
    this.props.dispatch(addFrequency(frequencyName));
    this.setState({
      frequencyName: '',
    });
  };

  render() {
    const frequencies = this.props.frequencies.frequencies;
    const activeFrequency = this.props.frequencies.active;
    const user = this.props.user;
    // const myFrequencies = helpers.getMyFrequencies(frequencies, user)
    // const publicFrequencies = helpers.getPublicFrequencies(frequencies, user)

    return (
      <Column>
        {user.uid
          ? <Header>
              <Avatar src={user.photoURL} title="Bryn Jackson" />
              <MetaWrapper>
                <Name>{user.displayName}</Name>
                <P>
                  <MetaLink onClick={this.signOut}>Sign Out</MetaLink>
                </P>
              </MetaWrapper>
            </Header>
          : <Header login>
              <HeaderLogo src="/img/logo.png" role="presentation" />
            </Header>}
        <FreqList>
          <FreqListHeading>My Frequencies</FreqListHeading>

          <Link to="/">
            <Freq active={this.props.frequencies.active === 'all'}>
              <FreqIcon src="/img/everything-icon.svg" />
              <FreqLabel>Everything</FreqLabel>
            </Freq>
          </Link>

          {frequencies &&
            frequencies.map((frequency, i) => {
              return (
                <Link to={`/${frequency.id}`} key={i}>
                  <Freq active={frequency.id === activeFrequency}>
                    <FreqGlyph>~</FreqGlyph>
                    <FreqLabel>{frequency.name}</FreqLabel>
                  </Freq>
                </Link>
              );
            })}

        </FreqList>
        <Form onSubmit={this.addFrequency}>
          <Input
            type="text"
            onChange={this.updateFrequencyName}
            value={this.state.frequencyName}
            placeholder="+ Create a Frequency"
          />
          <Button type="submit">~</Button>
        </Form>

        <Footer>
          <FooterLogo src="/img/mark.svg" />
          <MetaWrapper>
            <FooterP>© 2017 Spec Network, Inc.</FooterP>
            <FooterP>
              <MetaLink href="https://spec.fm/about"> About</MetaLink>
              &nbsp;·&nbsp;
              <MetaLink href="mailto:spectrum@spec.fm">Contact</MetaLink>
            </FooterP>
          </MetaWrapper>
        </Footer>
      </Column>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  frequencies: state.frequencies,
});

export default connect(mapStateToProps)(NavigationMaster);
