import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { login, signOut } from '../../../actions/user';
import { showModal } from '../../../actions/modals';
import { setActiveFrequency, addFrequency } from '../../../actions/frequencies';
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

  createFrequency = e => {
    e.preventDefault();
    this.props.dispatch(showModal('FREQUENCY_CREATION_MODAL'));
  };

  render() {
    const user = this.props.user;
    const frequencies = this.props.frequencies.frequencies.filter(
      frequency => frequency.users[user.uid],
    );
    const activeFrequency = this.props.frequencies.active;
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
            <Freq active={this.props.frequencies.active === 'everything'}>
              <FreqIcon src="/img/everything-icon.svg" />
              <FreqLabel>Everything</FreqLabel>
            </Freq>
          </Link>

          {frequencies &&
            frequencies.map((frequency, i) => {
              return (
                <Link to={`/~${frequency.slug}`} key={i}>
                  <Freq active={frequency.slug === activeFrequency}>
                    <FreqGlyph>~</FreqGlyph>
                    <FreqLabel>{frequency.name}</FreqLabel>
                  </Freq>
                </Link>
              );
            })}

        </FreqList>

        <Button onClick={this.createFrequency}>~ Create Frequency</Button>

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
