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
  Footer,
  FooterP,
  FreqText,
  DirtyDot,
  ProBadge,
  CommunityHeading,
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
        {user.uid &&
          <Header>
            <Avatar src={user.photoURL} title={user.displayName} />
            <MetaWrapper>
              <Name>
                {user.displayName}
                {user.subscriptions && <ProBadge>PRO</ProBadge>}
              </Name>
              <P>
                {user.subscriptions
                  ? <MetaAnchor onClick={this.showEditAccountModal}>
                      My Account
                    </MetaAnchor>
                  : <MetaAnchor pro onClick={this.showUpgradeModal}>
                      Upgrade to Pro
                    </MetaAnchor>}
              </P>
            </MetaWrapper>
          </Header>}
        <FreqList>
          {user.uid &&
            <div>
              <Link to="/">
                <Freq active={isEverything} onClick={this.showStoriesNav}>
                  <FreqText>
                    <Icon icon="home" reverse static />
                    <FreqLabel ml>{'Home'}</FreqLabel>
                  </FreqText>
                </Freq>
              </Link>

              {messageGroups.length > 0 && // only show messages in sidebar if user has existing messageGroups
                <Link to={`/messages`}>
                  <Freq active={isMessages} onClick={this.showStoriesNav}>
                    <FlexRow center>
                      <Icon reverse static icon="messages" />
                      <FreqLabel ml>Messages</FreqLabel>
                    </FlexRow>

                    {unreadMessageGroups && <DirtyDot />}
                  </Freq>
                </Link>}

              <Link to="/explore">
                <Freq active={isExplore} onClick={this.showStoriesNav}>
                  <FreqText>
                    <Icon icon="explore" reverse static />
                    <FreqLabel ml>{'Explore'}</FreqLabel>
                  </FreqText>
                </Freq>
              </Link>
            </div>}
          {!loaded &&
            <Freq>
              <FreqText>
                <Spinner color="text.reverse" inline />
                <FreqLabel>Loading…</FreqLabel>
              </FreqText>
            </Freq>}

          {user.uid &&
            frequencies &&
            Object.keys(frequencies).map(community => {
              const comm = communities.find(comm => comm.id === community);
              return (
                <div key={`nav-community-${community}`}>
                  <CommunityHeading>
                    {comm ? comm.name : 'Loading...'}
                  </CommunityHeading>
                  <div>
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
                          <Freq
                            active={
                              ((frequency.slug &&
                                frequency.slug === activeFrequency) ||
                                (frequency.id &&
                                  frequency.id === activeFrequency)) &&
                                comm.slug === active
                            }
                            onClick={this.showStoriesNav}
                          >
                            <FlexRow center>
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
            </Button>} */}
        </FreqList>

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
