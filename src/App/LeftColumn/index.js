import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { login, signOut } from '../../actions/user';
import { openModal } from '../../actions/modals';
import Icon from '../../shared/Icons';
import { FlexRow } from '../../shared/Globals';
import { groupBy } from '../../helpers/utils';
import { setActiveFrequency } from '../../actions/frequencies';
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
  FreqText,
  DirtyDot,
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

  showStoriesNav = () => {
    this.props.dispatch({
      type: 'SHOW_STORIES_NAV',
    });
  };

  render() {
    const {
      notifications,
      user,
      unread,
      frequencies,
      communities,
      activeFrequency,
      loaded,
    } = this.props;
    // const myFrequencies = helpers.getMyFrequencies(frequencies, user)
    // const publicFrequencies = helpers.getPublicFrequencies(frequencies, user)

    return (
      <Column>
        {user.uid
          ? <Header>
              <Avatar src={user.photoURL} title={user.displayName} />
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
          {user.uid &&
            <div>
              <Link to="/">
                <Freq
                  active={activeFrequency === 'everything'}
                  onClick={this.showStoriesNav}
                >
                  <FreqText>
                    <Icon icon="home" reverse static />
                    <FreqLabel>{'Home'}</FreqLabel>
                  </FreqText>
                </Freq>
              </Link>
              <Link to={`/notifications`}>
                <Freq
                  active={activeFrequency === 'notifications'}
                  onClick={this.showStoriesNav}
                >
                  <FlexRow center>
                    <Icon reverse static icon="notification" />
                    <FreqLabel>Notifications</FreqLabel>
                  </FlexRow>
                  {unread > 0 && <DirtyDot>{unread}</DirtyDot>}
                </Freq>
              </Link>
            </div>}
          {!loaded &&
            <Freq>
              <FreqText>
                <Icon icon="everything" reverse static />
                <FreqLabel>Loading…</FreqLabel>
              </FreqText>
            </Freq>}

          {user.uid &&
            frequencies &&
            Object.keys(frequencies).map(community => {
              const comm = communities.find(comm => comm.id === community);
              return (
                <div key={`nav-community-${community}`}>
                  <P>{comm ? comm.name : 'Loading...'}</P>
                  <div>
                    {frequencies[community].map((frequency, i) => {
                      // If there's any unread notification for this frequency
                      // show a dirty dot
                      const notif = notifications.find(notification => {
                        if (notification.ids.frequency !== frequency.id)
                          return false;
                        if (!frequency.stories || !notification.ids.story)
                          return true;
                        const storyData = frequency.stories[
                          notification.ids.story
                        ];
                        if (storyData && storyData.deleted) return false;
                        return true;
                      });
                      return (
                        <Link
                          to={
                            `/${comm
                              ? comm.slug
                              : community}/~${frequency.slug || frequency.id}`
                          }
                          key={`nav-frequency-${frequency.id}`}
                        >
                          <Freq
                            active={
                              frequency.slug &&
                                frequency.slug === activeFrequency ||
                                frequency.id && frequency.id === activeFrequency
                            }
                            onClick={this.showStoriesNav}
                          >
                            <FlexRow center>
                              <Icon icon="frequency" reverse static />
                              <FreqLabel>{frequency.name}</FreqLabel>
                            </FlexRow>
                            {notif && !notif.read && <DirtyDot />}
                          </Freq>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}

          {/* {user.uid &&
            <Button onClick={this.createFrequency}>
              <span>~ Create Frequency</span>
            </Button>} */
          }
        </FreqList>

        <Footer>
          <FooterP onClick={this.showStoriesNav}>
            <MetaLink to="/~support">Support</MetaLink>&nbsp;·&nbsp;
            <MetaLink to="/~hugs-n-bugs">Report Bugs</MetaLink>
          </FooterP>
          <FooterP onClick={this.showStoriesNav}>
            <MetaLink to="/~feature-requests">Feature Requests</MetaLink>
            &nbsp;·&nbsp;
            <MetaAnchor href="mailto:hi@spectrum.chat">Contact</MetaAnchor>
          </FooterP>
          <FooterP>© 2017 Space Program, Inc.</FooterP>
        </Footer>
      </Column>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  frequencies: state.frequencies.byCommunity,
  communities: state.communities.communities,
  activeFrequency: state.frequencies.active,
  loaded: state.frequencies.loaded,
  ui: state.ui,
  notifications: state.notifications.notifications,
});

export default connect(mapStateToProps)(NavigationMaster);
