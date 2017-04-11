//@flow
import React, { Component } from 'react';
//$FlowFixMe
import { Link } from 'react-router-dom';
//$FlowFixMe
import { connect } from 'react-redux';
//$FlowFixMe
import deepEqual from 'deep-eql';
import {
  NavBarContainer,
  Logo,
  Text,
  Subtitle,
  Title,
  Avatar,
  Photo,
  Menu,
} from './style';
import Icon from '../../shared/Icons';
import { Spinner, Button } from '../../shared/Globals';
import { openModal } from '../../actions/modals';
import { toggleComposer } from '../../actions/composer';

class NavBar extends Component {
  state = {
    user: null,
    activeStory: null,
    activeFrequency: null,
    activeCommunity: null,
    activeMessageGroup: null,
    viewing: 'stories',
  };

  // used on mobile when closing the story view
  clearActiveStory = () => {
    this.props.dispatch({
      type: 'CLEAR_ACTIVE_STORY',
    });
  };

  // used on mobile when closing the story view
  clearActiveMessageGroup = () => {
    this.props.dispatch({
      type: 'CLEAR_ACTIVE_MESSAGE_GROUP',
    });
  };

  showFrequenciesNav = () => {
    this.props.dispatch({
      type: 'SHOW_FREQUENCY_NAV',
    });
  };

  closeFrequenciesNav = () => {
    this.props.dispatch({
      type: 'CLOSE_FREQUENCY_NAV',
    });
  };

  openUserProfileModal = () => {
    this.props.dispatch(
      openModal('USER_PROFILE_MODAL', { user: this.props.user.uid }),
    );
  };

  showEditAccountModal = () => {
    this.props.dispatch(openModal('EDIT_ACCOUNT_MODAL', this.props.user));
  };

  handleComposerClick = () => {
    const { composer: { isOpen } } = this.props;
    if (isOpen) {
      this.props.dispatch({
        type: 'CLOSE_COMPOSER',
      });
    } else {
      this.props.dispatch({
        type: 'TOGGLE_COMPOSER_OPEN',
      });
    }
  };

  componentWillMount = () => {
    const width = window.innerWidth;
    const { user } = this.props;
    const activeStory = this.getActiveStory();
    const activeFrequency = this.getActiveFrequency(activeStory);
    const activeCommunity = this.getActiveCommunity(activeFrequency);
    const activeMessageGroup = this.getActiveMessageGroup();

    this.setState({
      user,
      activeStory,
      activeFrequency,
      activeCommunity,
      activeMessageGroup,
    });
  };

  shouldComponentUpdate = (nextProps: Object) => {
    return !deepEqual(nextProps, this.props);
  };

  componentWillUpdate = (prevProps: Object) => {
    if (prevProps !== this.props) {
      const { user } = this.props;
      const activeStory = this.getActiveStory();
      const activeFrequency = this.getActiveFrequency(activeStory);
      const activeCommunity = this.getActiveCommunity(activeFrequency);
      const activeMessageGroup = this.getActiveMessageGroup();

      this.setState({
        user,
        activeStory,
        activeFrequency,
        activeCommunity,
        activeMessageGroup,
      });
    }
  };

  componentDidUpdate = (prevProps: Object) => {
    if (prevProps !== this.props) {
      const { user } = this.props;
      const activeStory = this.getActiveStory();
      const activeFrequency = this.getActiveFrequency(activeStory);
      const activeCommunity = this.getActiveCommunity(activeFrequency);
      const activeMessageGroup = this.getActiveMessageGroup();

      this.setState({
        user,
        activeStory,
        activeFrequency,
        activeCommunity,
        activeMessageGroup,
      });
    }
  };

  getActiveMessageGroup = () => {
    const { messageGroups: { messageGroups, active } } = this.props;
    return messageGroups.find(group => group.id === active);
  };

  getActiveStory = () => {
    const { stories: { stories, active } } = this.props;
    return stories.find(story => story.id === active);
  };

  getActiveFrequency = (story: Object) => {
    if (!story) return;
    const { frequencies: { frequencies } } = this.props;
    return frequencies.find(frequency => frequency.id === story.frequencyId);
  };

  getActiveCommunity = (frequency: Object) => {
    if (!frequency) return;
    const { communities: { communities } } = this.props;
    return communities.find(
      community => community.id === frequency.communityId,
    );
  };

  leftAction = () => {
    const width = window.innerWidth;
    const { composer, communities: { active } } = this.props;
    const usersList = this.state.user.list;
    const activeStory = this.state.activeStory;
    const activeFrequency = this.state.activeFrequency;
    const activeCommunity = this.state.activeCommunity;
    const activeMessageGroup = this.state.activeMessageGroup;

    if (width > 768) {
      return (
        <Link to="/">
          <Logo src="/img/mark-white.png" role="presentation" />
        </Link>
      );
    }

    if (active === 'explore') {
      return (
        <Link to={`/`}>
          <Icon icon="close" reverse />
        </Link>
      );
    }

    if (composer.isOpen) {
      return <div style={{ width: '44px' }} />;
    }

    if (!activeStory && activeMessageGroup) {
      return (
        <Link to={`/messages`} onClick={this.clearActiveMessageGroup}>
          <Icon icon="back" reverse />
        </Link>
      );
    }

    if (
      activeStory && activeCommunity && activeFrequency && !activeMessageGroup
    ) {
      const communitySlug = active === 'everything'
        ? 'everything'
        : activeCommunity.slug;
      const frequencySlug = active === 'everything' ? '' : activeFrequency.slug;
      return (
        <Link
          to={`/${communitySlug}/${frequencySlug}`}
          onClick={this.clearActiveStory}
        >
          <Icon icon="back" reverse />
        </Link>
      );
    }

    if (activeStory && activeCommunity) {
      return (
        <Link
          to={`/${activeCommunity.slug}/${activeFrequency.slug}`}
          onClick={this.clearActiveStory}
        >
          <Icon icon="back" reverse />
        </Link>
      );
    }

    if (activeMessageGroup) {
      return (
        <Link to="/messages" onClick={this.clearActiveMessageGroup}>
          <Icon icon="back" reverse />
        </Link>
      );
    }

    return (
      <Menu
        onClick={
          this.props.ui.viewing === 'frequencies'
            ? this.closeFrequenciesNav
            : this.showFrequenciesNav
        }
      >
        <Icon
          icon={this.props.ui.viewing === 'frequencies' ? 'close' : 'menu'}
          reverse
        />
      </Menu>
    );
  };

  rightAction = () => {
    const width = window.innerWidth;
    const { composer, communities: { active } } = this.props;
    const user = this.state.user;
    const activeStory = this.state.activeStory;
    const activeFrequency = this.state.activeFrequency;
    const activeCommunity = this.state.activeCommunity;
    const activeMessageGroup = this.state.activeMessageGroup;
    const isPro = user && user.subscriptions ? true : false;

    if (width > 768 && user.uid) {
      return (
        <Avatar
          onClick={
            isPro ? this.showEditAccountModal : this.openUserProfileModal
          }
        >
          <Photo src={user.photoURL} />
        </Avatar>
      );
    }

    if (
      !activeStory &&
      !activeMessageGroup &&
      user.uid &&
      active !== 'messages' &&
      active !== 'explore' &&
      active !== 'everything'
    ) {
      return (
        <span onClick={this.handleComposerClick}>
          <Icon
            icon={composer.isOpen ? 'close' : 'write'}
            tipLocation="left"
            tipText="New Story"
            color={composer.isOpen ? 'warn.alt' : 'text.reverse'}
            reverse
          />
        </span>
      );
    }

    if (!activeStory && !activeMessageGroup && !user.uid) {
      return <div style={{ width: '44px' }} />;
    }

    // placeholder for flexbox
    return <div style={{ width: '44px' }} />;
  };

  render() {
    const {
      user,
      communities,
      frequencies,
      messageGroups,
      stories,
      composer,
    } = this.props;

    const width = window.innerWidth;
    const communityString = communities.active;
    const frequencyString = frequencies.active;
    const currentUser = user;
    const usersList = this.state.user.list;
    const activeStory = this.state.activeStory;
    const activeFrequency = this.state.activeFrequency;
    const activeCommunity = this.state.activeCommunity;
    const activeMessageGroup = this.state.activeMessageGroup;
    const isLoggedIn = user.uid !== null;
    const isPro = user && user.subscriptions ? true : false;

    const recipients = activeMessageGroup
      ? Object.keys(activeMessageGroup.users)
          .map(user => usersList[user]) // get the user objects
          .filter(user => user.uid !== currentUser.uid) // filter out the current user
          .map(user => user.displayName)
          .join(',')
      : null;

    let subtitle = activeFrequency
      ? `${activeCommunity.name} · ${activeFrequency.name}`
      : activeMessageGroup ? `Messages with` : '';

    if (
      !activeFrequency &&
      !activeStory &&
      (communityString !== 'messages' &&
        communityString !== 'everything' &&
        communityString !== 'explore')
    ) {
      subtitle = communityString.charAt(0).toUpperCase() +
        communityString.slice(1);
    }

    let title = communityString === 'messages'
      ? 'Messages'
      : communityString === 'explore'
          ? 'Explore'
          : communityString === 'everything'
              ? 'Home'
              : frequencyString.charAt(0).toUpperCase() +
                  frequencyString.slice(1);

    if (activeStory || recipients) {
      title = activeStory
        ? `${activeStory.content.title}`
        : recipients ? `${recipients}` : '';
    }

    if (communityString === 'messages' && !messageGroups.active) {
      title = 'Messages';
      subtitle = '';
    }

    if (composer.isOpen) {
      title = 'New Story';
      subtitle = '';
    }

    if (
      messageGroups.active && !activeMessageGroup ||
      stories.active && !activeStory
    ) {
      return (
        <NavBarContainer>
          {this.leftAction()}

          {width < 768 && <Spinner white />}

          {width > 768 &&
            user.uid &&
            <Avatar
              onClick={
                isPro ? this.showEditAccountModal : this.openUserProfileModal
              }
            >
              <Photo src={user.photoURL} />
            </Avatar>}

          {width > 768 && !user.uid && <div style={{ width: '44px' }} />}
        </NavBarContainer>
      );
    }

    return (
      <NavBarContainer>
        {this.leftAction()}

        {width < 768
          ? <Text>
              <Subtitle>{subtitle}</Subtitle>
              <Title large={!subtitle}>{title}</Title>
            </Text>
          : <div />}

        {this.rightAction()}
      </NavBarContainer>
    );
  }
}

export const mapStateToProps = state => ({
  user: state.user,
  messageGroups: state.messageGroups,
  communities: state.communities,
  frequencies: state.frequencies,
  stories: state.stories,
  ui: state.ui,
  composer: state.composer,
});

export default connect(mapStateToProps)(NavBar);
