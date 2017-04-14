import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { login, signOut } from '../../actions/user';
import { openModal } from '../../actions/modals';
import Icon from '../../shared/Icons';
import { FlexRow, Spinner } from '../../shared/Globals';
import { setActiveFrequency } from '../../actions/frequencies';
import { track } from '../../EventTracker';
import { ACTIVITY_TYPES } from '../../db/types';
import {
  Column,
  MetaAnchor,
  MetaLink,
  List,
  ListHeading,
  ListContainer,
  ListItem,
  NavButton,
  Label,
  Footer,
  FooterP,
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

  showUpgradeModal = () => {
    track('upgrade', 'inited', 'nav profile');
    this.props.dispatch(openModal('UPGRADE_MODAL', this.props.user));
  };

  showEditAccountModal = () => {
    this.props.dispatch(openModal('EDIT_ACCOUNT_MODAL', this.props.user));
  };

  render() {
    const {
      notifications,
      user,
      messageGroups: { messageGroups },
      frequencies,
      communities: { communities, active },
      activeFrequency,
      loaded,
    } = this.props;

    const isEverything = active === 'everything';
    const isNotifications = active === 'notifications';
    const isMessages = active === 'messages';
    const isExplore = active === 'explore';

    // if any of the messageGroups have activity that is greater than last_seen, return
    // true and show a dirty dot in the ui
    const unreadMessageGroups = messageGroups.some(group => {
      const me = group.users[user.uid];
      if (
        group.id !== this.props.messageGroups.active &&
        (group.last_activity > me.last_seen || !me.last_seen)
      ) {
        return true;
      }
    });

    return (
      <Column>
        <List>
          {user.uid &&
            <ListContainer>
              <Link to="/">
                <ListItem>
                  <NavButton
                    active={isEverything}
                    onClick={this.showStoriesNav}
                  >
                    <Icon
                      icon="home"
                      color={isEverything ? 'brand.default' : 'text.alt'}
                      static
                    />
                    <Label>{'Home'}</Label>
                  </NavButton>
                </ListItem>
              </Link>

              {/*<Link to={`/notifications`}>
                <ListItem>
                  <NavButton
                    active={isNotifications}
                    onClick={this.showStoriesNav}
                  >
                    <Icon
                      icon="notification"
                      color={isNotifications ? 'brand.default' : 'text.alt'}
                      static
                    />
                    <Label ml>Notifications</Label>
                  </NavButton>
                </ListItem>
              </Link>*/}

              {messageGroups.length > 0 &&
                // only show messages in sidebar if user has existing messageGroups
                <Link to={`/messages`}>
                  <ListItem>
                    <NavButton
                      active={isMessages}
                      onClick={this.showStoriesNav}
                    >
                      <Icon
                        icon="messages"
                        color={isMessages ? 'brand.default' : 'text.alt'}
                        static
                      />
                      <Label>Messages</Label>
                      {unreadMessageGroups && <DirtyDot />}
                    </NavButton>
                  </ListItem>
                </Link>}

              <Link to="/explore">
                <ListItem>
                  <NavButton active={isExplore} onClick={this.showStoriesNav}>
                    <Icon
                      icon="explore"
                      color={isExplore ? 'brand.default' : 'text.alt'}
                      static
                    />
                    <Label>{'Explore'}</Label>
                  </NavButton>
                </ListItem>
              </Link>
            </ListContainer>}

          {!loaded &&

            <ListContainer>
              <ListItem>
                <NavButton>
                  <Spinner color="text.placeholder" inline />
                  <Label>Loading frequencies…</Label>
                </NavButton>
              </ListItem>
            </ListContainer>}

          {user.uid &&
            frequencies &&
            Object.keys(frequencies).map(community => {
              const comm = communities.find(comm => comm.id === community);
              return (
                <div key={`nav-community-${community}`}>
                  <ListHeading>
                    {comm ? comm.name : 'Loading...'}
                  </ListHeading>
                  <ListContainer>
                    {frequencies[community].map((frequency, i) => {
                      // If there's any unread notification for this frequency
                      // show a dirty dot
                      const notif = notifications.find(notification => {
                        // Only show a dirty dot for new messages
                        if (
                          notification.activityType !==
                          ACTIVITY_TYPES.NEW_MESSAGE
                        )
                          return false;
                        if (notification.ids.frequency !== frequency.id)
                          return false;
                        if (!frequency.stories || !notification.ids.story)
                          return true;
                        const storyData =
                          frequency.stories[notification.ids.story];
                        if (storyData && storyData.deleted) return false;
                        return true;
                      });
                      return (
                        <Link
                          to={`/${comm ? comm.slug : community}/~${frequency.slug || frequency.id}`}
                          key={`nav-frequency-${frequency.id}`}
                        >
                          <ListItem
                            active={
                              ((frequency.slug &&
                                frequency.slug === activeFrequency) ||
                                (frequency.id &&
                                  frequency.id === activeFrequency)) &&
                                comm.slug === active
                            }
                            onClick={this.showStoriesNav}
                          >
                            <NavButton>
                              <Icon
                                icon="frequency"
                                color="text.placeholder"
                                static
                              />
                              <Label>{frequency.name}</Label>
                              {notif && !notif.read && <DirtyDot />}
                            </NavButton>
                          </ListItem>
                        </Link>
                      );
                    })}
                  </ListContainer>
                </div>
              );
            })}

          {/* {user.uid &&
            <Button onClick={this.createFrequency}>
              <span>~ Create Frequency</span>
            </Button>} */}
        </List>

        <Footer>
          <FooterP onClick={this.showStoriesNav}>
            <MetaLink to="/spectrum/~support">Support</MetaLink>&nbsp;·&nbsp;
            <MetaLink to="/spectrum/~hugs-n-bugs">Report Bugs</MetaLink>
            &nbsp;·&nbsp;
            <MetaAnchor href="mailto:hi@spectrum.chat">Contact</MetaAnchor>
          </FooterP>
          <FooterP onClick={this.showStoriesNav}>
            <MetaLink to="/spectrum/~feature-requests">
              Feature Requests
            </MetaLink>
            &nbsp;·&nbsp;
            <MetaAnchor onClick={this.signOut}>Sign Out</MetaAnchor>
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
  communities: state.communities,
  activeFrequency: state.frequencies.active,
  loaded: state.frequencies.loaded,
  ui: state.ui,
  notifications: state.notifications.notifications,
  messageGroups: state.messageGroups,
});

export default connect(mapStateToProps)(NavigationMaster);
