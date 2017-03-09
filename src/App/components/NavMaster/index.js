import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { login, signOut } from '../../../actions/user';
import { openModal } from '../../../actions/modals';
import { setActiveFrequency } from '../../../actions/frequencies';
import {
  Column,
  Header,
  HeaderLogo,
  Avatar,
  MetaWrapper,
  MetaAnchor,
  P,
  Name,
  MetaLink,
  FreqList,
  Freq,
  FreqLabel,
  FreqIcon,
  FreqGlyph,
  Footer,
  FooterLogo,
  FooterP,
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
    this.props.dispatch(openModal('PRO_MODAL'));
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
    this.props.dispatch(openModal('FREQUENCY_CREATION_MODAL'));
  };

  hideNav = () => {
    this.props.dispatch({
      type: 'HIDE_NAV',
    });
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
      <Column navVisible={this.props.ui.navVisible}>
        {user.uid
          ? <Header>
              <Avatar src={user.photoURL} title="Bryn Jackson" />
              <MetaWrapper>
                <Name>{user.displayName}</Name>
                <P>
                  <MetaAnchor onClick={this.signOut}>Sign Out</MetaAnchor>
                </P>
              </MetaWrapper>
            </Header>
          : <Header login>
              <Link to="/">
                <HeaderLogo src="/img/logo.png" role="presentation" />
              </Link>
            </Header>}
        <FreqList>
          <Link to="/">
            <Freq
              active={this.props.frequencies.active === 'everything'}
              onClick={this.hideNav}
            >
              <FreqIcon src="/img/everything-icon.svg" />
              <FreqLabel>{user.uid ? 'Everything' : 'Home'}</FreqLabel>
            </Freq>
          </Link>

          {user.uid &&
            <Link to={`/notifications`}>
              <Freq
                active={activeFrequency === 'notifications'}
                onClick={this.hideNav}
              >
                <FreqLabel>Notifications</FreqLabel>
              </Freq>
            </Link>}
          {user.uid &&
            frequencies &&
            frequencies.map((frequency, i) => {
              return (
                <Link to={`/~${frequency.slug || frequency.id}`} key={i}>
                  <Freq
                    active={
                      frequency.slug && frequency.slug === activeFrequency ||
                        frequency.id && frequency.id === activeFrequency
                    }
                    onClick={this.hideNav}
                  >
                    <FreqGlyph>~</FreqGlyph>
                    <FreqLabel>{frequency.name}</FreqLabel>
                  </Freq>
                </Link>
              );
            })}
        </FreqList>

        {user.uid &&
          <Button onClick={this.createFrequency}>
            <span>~ Create Frequency</span>
          </Button>}

        <Footer>
          <FooterLogo src="/img/mark.svg" />
          <MetaWrapper>
            <FooterP>© 2017 Space Program, Inc.</FooterP>
            <FooterP>
              <MetaLink to="/about"> About</MetaLink>
              &nbsp;·&nbsp;
              <MetaAnchor href="mailto:hi@spectrum.chat">Contact</MetaAnchor>
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
  ui: state.ui,
});

export default connect(mapStateToProps)(NavigationMaster);
