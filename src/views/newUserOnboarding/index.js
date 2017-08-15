// @flow
import React, { Component } from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import compose from 'recompose/compose';
import { addToastWithTimeout } from '../../actions/toasts';
import FullscreenView from '../../components/fullscreenView';
import Icon from '../../components/icons';
import { Button, TextButton } from '../../components/buttons';
import UserInfo from './components/userInfo';
import SetUsername from './components/setUsername';
import JoinFirstCommunity from './components/joinFirstCommunity';
import TopCommunities from './components/discoverCommunities';
import Search from './components/communitySearch';
import { editUserMutation } from '../../api/user';
import {
  OnboardingContainer,
  OnboardingContent,
  OnboardingNav,
  IconContainer,
  Title,
  Subtitle,
  Emoji,
  ContinueButton,
  Container,
} from './style';

class NewUserOnboarding extends Component {
  state: {
    activeStep: string,
    isLoading: boolean,
    username: any,
  };

  constructor(props) {
    super(props);
    const { hasUsername } = this.props;
    this.state = {
      activeStep: hasUsername ? 'discoverCommunities' : 'welcome',
      isLoading: false,
      username: null,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    // don't reload the component as the user saves info
    if (!this.props.currentUser.username && nextProps.currentUser.username)
      return false;

    return true;
  }

  saveUsername = e => {
    this.setState({
      activeStep: 'updateUserInfo',
    });
  };

  usernameIsAvailable = (username: string) => {
    return this.setState({
      username,
    });
  };

  toStep = (step: string) => {
    return this.setState({
      activeStep: step,
    });
  };

  render() {
    const { community, currentUser, hasUsername } = this.props;
    const { activeStep, isLoading, username } = this.state;

    const steps = {
      welcome: {
        title: 'Welcome to Spectrum!',
        subtitle:
          'Spectrum is a place where communities can share, discuss, and grow together. Before we jump into your first community, there are just a few things we need to do...',
        icon: null,
        emoji: '👋',
      },
      setUsername: {
        title: 'Who goes there, stranger?',
        subtitle:
          "Everyone around here has a special, one-of-a-kind username. What's yours going to be?",
        icon: null,
        emoji: '👩‍🚀',
      },
      joinFirstCommunity: {
        // will be triggered if the user signed up via a community, channel, or thread view
        title: 'Now, where were we...',
        subtitle: `You were in the middle of something. Let's get back on track and join your first community.`,
        icon: null,
        emoji: '🤔',
      },
      updateUserInfo: {
        title: 'Allow you to reintroduce yourself.',
        subtitle:
          "This isn't your grandma's social network! Customize your look and share a bit more about who you are.",
        icon: null,
        emoji: null,
      },
      discoverCommunities: {
        title: community ? "One just isn't enough..." : 'Find your people.',
        subtitle:
          'There are hundreds of communities on Spectrum to explore. Check out some of our favorites below or search for topics.',
        icon: null,
        emoji: null,
      },
      done: {
        title: "You're going to do great things here.",
        subtitle:
          "We've reached the end of our time together – now it's time to venture forth and join the conversation!",
        icon: null,
        emoji: '🎉',
      },
    };

    const isMobile = window.innerWidth < 768;

    return (
      <FullscreenView
        hasBackground={!isMobile}
        close={this.props.close}
        noClose={this.props.noClose}
      >
        <OnboardingContainer>
          <OnboardingContent>
            <IconContainer>
              {steps[activeStep].icon &&
                <Icon glyph={steps[activeStep].icon} size={64} />}
              {steps[activeStep].emoji &&
                <Emoji>
                  {steps[activeStep].emoji}
                </Emoji>}
            </IconContainer>
            <Title>
              {steps[activeStep].title}
            </Title>
            <Subtitle>
              {steps[activeStep].subtitle}
            </Subtitle>

            {activeStep === 'welcome' &&
              <ContinueButton
                onClick={() =>
                  this.toStep(
                    hasUsername ? 'discoverCommunities' : 'setUsername'
                  )}
              >
                Get Started
              </ContinueButton>}

            {activeStep === 'setUsername' &&
              <SetUsername
                user={currentUser}
                initialUsername={username}
                save={this.saveUsername}
                isAvailable={this.usernameIsAvailable}
              />}

            {activeStep === 'updateUserInfo' &&
              <UserInfo
                save={() =>
                  this.toStep(
                    community && community.id
                      ? 'joinFirstCommunity'
                      : 'discoverCommunities'
                  )}
                user={currentUser}
              />}

            {activeStep === 'joinFirstCommunity' &&
              <JoinFirstCommunity community={community} />}

            {activeStep === 'discoverCommunities' &&
              <Container>
                <Search />
                <TopCommunities doneExploring={() => this.toStep('done')} />
              </Container>}

            {activeStep === 'done' &&
              <ContinueButton
                onClick={() =>
                  this.props.close
                    ? this.props.close()
                    : (window.location.href = '/')}
              >
                Finish this dang onboarding
              </ContinueButton>}
          </OnboardingContent>
        </OnboardingContainer>
      </FullscreenView>
    );
  }
}

const map = state => ({
  currentUser: state.users.currentUser,
  community: state.newUserOnboarding.community,
});
export default compose(connect(map))(NewUserOnboarding);
