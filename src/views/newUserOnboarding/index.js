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
import { UpsellCreateCommunity } from '../../components/upsell';
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
  CreateUpsellContainer,
} from './style';

class NewUserOnboarding extends Component {
  state: {
    activeStep: string,
    isLoading: boolean,
    username: any,
    joinedCommunities: number,
  };

  constructor(props) {
    super(props);
    const { hasUsername } = this.props;
    this.state = {
      activeStep: hasUsername ? 'discoverCommunities' : 'welcome',
      isLoading: false,
      username: null,
      joinedCommunities: 0,
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

  joinedCommunity = (number, step) => {
    const { joinedCommunities } = this.state;
    let newCount = joinedCommunities + number;

    this.setState({ joinedCommunities: newCount });

    if (step) {
      this.toStep(step);
    }
  };

  render() {
    const { community, currentUser, hasUsername } = this.props;
    const { activeStep, isLoading, username, joinedCommunities } = this.state;

    const steps = {
      welcome: {
        title: 'Welcome to Spectrum!',
        subtitle:
          'Spectrum is a place where communities can share, discuss, and grow together. To get started, create a username.',
        emoji: '👋',
      },
      joinFirstCommunity: {
        // will be triggered if the user signed up via a community, channel, or thread view
        title: 'Now, where were we...',
        subtitle: `You were in the middle of something. Let's get back on track and join your first community.`,
        emoji: '🤔',
      },
      updateUserInfo: {
        title: 'Allow you to reintroduce yourself.',
        subtitle:
          "This isn't your grandma's social network! Customize your look and share a bit more about who you are.",
        emoji: null,
      },
      discoverCommunities: {
        title: 'Find your people.',
        subtitle:
          'There are hundreds of communities on Spectrum to explore. Check out some of our favorites below or search for topics.',
        emoji: null,
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
              <JoinFirstCommunity
                community={community}
                joinedFirstCommunity={() =>
                  this.joinedCommunity(1, 'discoverCommunities')}
              />}

            {activeStep === 'discoverCommunities' &&
              <Container>
                <Search />
                <TopCommunities
                  joinedCommunity={this.joinedCommunity}
                  hasJoined={joinedCommunities > 0}
                  doneExploring={() => (window.location.href = '/')}
                />
                <CreateUpsellContainer extra={joinedCommunities > 0}>
                  <UpsellCreateCommunity close={this.props.close} />
                </CreateUpsellContainer>
              </Container>}
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
