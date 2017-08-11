// @flow
import React, { Component } from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import compose from 'recompose/compose';
import { addToastWithTimeout } from '../../actions/toasts';
import FullscreenView from '../../components/fullscreenView';
import SetUsername from '../../components/setUsername';
import Icon from '../../components/icons';
import { Button, TextButton } from '../../components/buttons';
import UserInfo from './components/userInfo';
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
} from './style';

class NewUserOnboarding extends Component {
  state: {
    activeStep: string,
    isLoading: boolean,
    username: any,
  };

  constructor() {
    super();

    this.state = {
      activeStep: 'updateUserInfo',
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
    e.preventDefault();
    const { username } = this.state;
    const { community } = this.props;

    if (!username || username.length === 0 || username.length > 20) return;

    this.setState({
      isLoading: true,
    });

    const input = {
      username,
    };

    this.props
      .editUser(input)
      .then(({ data: { user } }) => {
        this.setState({
          isLoading: false,
          activeStep: 'updateUserInfo',
        });
      })
      .catch(err => {
        this.setState({
          isLoading: false,
        });
        this.props.dispatch(addToastWithTimeout('error', err.message));
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
    const { community, currentUser } = this.props;
    const { activeStep, isLoading, username } = this.state;

    const steps = {
      joinFirstCommunity: {
        // will be triggered if the user signed up via a community, channel, or thread view
        title: 'Now, where were we...',
        subtitle: `You were in the middle of something. Let's get back on track and join your first community.`,
        icon: null,
        emoji: '🤔',
      },
      welcome: {
        title: 'Welcome to Spectrum!',
        subtitle:
          'Spectrum is a place where communities can share, discuss, and grow together. Before we jump into your first community, there are just a few things we need to ask.',
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
      updateUserInfo: {
        title: 'Allow you to reintroduce yourself.',
        subtitle:
          "This isn't your grandma's social network! Customize your look and share a bit more about who you are.",
        icon: null,
        emoji: '🖌',
      },
      discoverCommunities: {
        title: 'The internet is more fun with friends.',
        subtitle:
          'There are hundreds of communities on Spectrum to explore. Check out some of our favorites, or search for topics.',
        icon: null,
        emoji: '✨',
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
      <FullscreenView hasBackground={!isMobile} close={this.props.close}>
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
              <ContinueButton onClick={() => this.toStep('setUsername')}>
                Get Started
              </ContinueButton>}

            {activeStep === 'setUsername' &&
              <SetUsername
                user={currentUser}
                initialUsername={username}
                submit={this.saveUsername}
                isAvailable={this.usernameIsAvailable}
              />}

            {activeStep === 'updateUserInfo' && <UserInfo user={currentUser} />}

            {activeStep === 'joinFirstCommunity' &&
              <div>join first community</div>}

            {activeStep === 'discoverCommunities' &&
              <div>Discover communities</div>}

            {activeStep === 'done' &&
              <ContinueButton onClick={this.props.close}>
                Finish this dang onboarding
              </ContinueButton>}
          </OnboardingContent>

          {activeStep === 'setUsername' &&
            <OnboardingNav>
              <div />
              <Button
                style={{ fontSize: '16px', padding: '16px 24px' }}
                disabled={!username}
                loading={isLoading}
                onClick={this.saveUsername}
              >
                Save and continue
              </Button>
            </OnboardingNav>}

          {activeStep === 'updateUserInfo' &&
            <OnboardingNav>
              <TextButton onClick={() => this.toStep('setUsername')}>
                Change my username
              </TextButton>
              <Button
                onClick={() =>
                  this.toStep(
                    community && community.id
                      ? 'joinFirstCommunity'
                      : 'discoverCommunities'
                  )}
                style={{ fontSize: '16px', padding: '16px 24px' }}
              >
                Onwards!
              </Button>
            </OnboardingNav>}

          {activeStep === 'joinFirstCommunity' &&
            <OnboardingNav>
              <TextButton onClick={() => this.toStep('updateUserInfo')}>
                Update my info
              </TextButton>
              <Button
                onClick={() => this.toStep('discoverCommunities')}
                style={{ fontSize: '16px', padding: '16px 24px' }}
              >
                Keep going
              </Button>
            </OnboardingNav>}

          {activeStep === 'discoverCommunities' &&
            <OnboardingNav>
              <TextButton
                onClick={() =>
                  this.toStep(
                    community && community.id
                      ? 'joinFirstCommunity'
                      : 'updateUserInfo'
                  )}
              >
                {community && community.id ? 'Back a step' : 'Update my info'}
              </TextButton>
              <Button
                onClick={() => this.toStep('done')}
                style={{ fontSize: '16px', padding: '16px 24px' }}
              >
                I'm done exploring
              </Button>
            </OnboardingNav>}
        </OnboardingContainer>
      </FullscreenView>
    );
  }
}

const map = state => ({
  currentUser: state.users.currentUser,
  community: state.newUserOnboarding.community,
});
export default compose(editUserMutation, connect(map))(NewUserOnboarding);
