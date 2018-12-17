// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import FullscreenView from '../../components/fullscreenView';
import { UpsellCreateCommunity } from '../../components/upsell';
import SetUsername from './components/setUsername';
import JoinFirstCommunity from './components/joinFirstCommunity';
import TopCommunities from './components/discoverCommunities';
import Search from './components/communitySearch';
import AppsUpsell from './components/appsUpsell';
import {
  OnboardingContainer,
  OnboardingContent,
  IconContainer,
  Title,
  Subtitle,
  Emoji,
  Container,
  CreateUpsellContainer,
  StickyRow,
  ContinueButton,
} from './style';
import { track, events } from 'src/helpers/analytics';
import type { UserInfoType } from 'shared/graphql/fragments/user/userInfo';
import type { CommunityInfoType } from 'shared/graphql/fragments/community/communityInfo';
import { isDesktopApp } from 'src/helpers/desktop-app-utils';

type StateProps = {|
  community: CommunityInfoType,
|};

type Props = StateProps & {|
  currentUser: UserInfoType,
  close: Function,
  noCloseButton: boolean,
|};

type ActiveStep =
  | 'discoverCommunities'
  | 'setUsername'
  | 'joinFirstCommunity'
  | 'appsUpsell';

type State = {|
  activeStep: ActiveStep,
  joinedCommunities: number,
  appUpsellCopy: {
    title: string,
    subtitle: string,
  },
|};

class NewUserOnboarding extends Component<Props, State> {
  _isMounted = false;

  constructor(props) {
    super(props);

    const { currentUser } = this.props;

    this.state = {
      // if the user has a username already, we know that the onboarding
      // was triggered because the user has not joined any communities yet
      activeStep:
        currentUser && currentUser.username
          ? 'discoverCommunities'
          : 'setUsername',
      // we make sure to only let the user continue to their dashboard
      // if they have joined one or more communities - because it's possible
      // to join and then leave a community in this onboarding component,
      // we keep track of the total joined count with a number, rathern than
      // a boolean
      joinedCommunities: 0,
      appUpsellCopy: {
        title: 'Download the app',
        subtitle: 'A better way to keep up with your communities.',
      },
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  saveUsername = () => {
    const { community } = this.props;

    track(events.USER_ONBOARDING_SET_USERNAME);

    if (!isDesktopApp()) return this.toStep('appsUpsell');

    // if the user signed up via a community, channel, or thread view, the first
    // thing they will be asked to do is set a username. After they save their
    // username, they should proceed to the 'joinFirstCommunity' step; otherwise
    // we can just close the onboarding
    if (community) {
      return this.props.close();
    }
    return this.toStep('joinFirstCommunity');
  };

  toStep = (step: ActiveStep) => {
    if (!this._isMounted) return;
    return this.setState({
      activeStep: step,
    });
  };

  joinedCommunity = (number: number, done: boolean) => {
    if (number > 0) {
      track(events.USER_ONBOARDING_JOINED_COMMUNITY);
    } else {
      track(events.USER_ONBOARDING_LEFT_COMMUNITY);
    }

    const { joinedCommunities } = this.state;
    // number will be either '1' or '-1' - so it will either increment
    // or decrement the joinedCommunities count in state
    let newCount = joinedCommunities + number;
    this.setState({ joinedCommunities: newCount });

    // if the user signed up from a community, channel, or thread view,
    // they will see an onboarding step to join that community they were
    // viewing in order to complete their onboarding. when they do join
    // that community, we pass a finish argument which will push them forward
    // in the onboarding flow
    if (done) {
      return this.props.close();
    }
  };

  appUpsellComplete = () => {
    const { community } = this.props;

    // if the user signed up via a community, channel, or thread view, the first
    // thing they will be asked to do is set a username. After they save their
    // username, they should proceed to the 'joinFirstCommunity' step; otherwise
    // we can just close the onboarding
    if (!community) return this.props.close();
    // if the user signed in via a comunity, channel, or thread view, but they
    // are already members of that community, we can escape the onboarding
    if (community.communityPermissions.isMember) return this.props.close();

    // if the user signed up via a community, channel, or thread view and
    // has not yet joined that community, move them to that step in the onboarding
    return this.toStep('joinFirstCommunity');
  };

  onAppDownload = () => {
    return this.setState({
      appUpsellCopy: {
        title: 'Your download is starting!',
        subtitle: 'Continue in the app, or keep going here.',
      },
    });
  };

  render() {
    const { community, currentUser } = this.props;
    const { activeStep, joinedCommunities, appUpsellCopy } = this.state;

    const steps = {
      setUsername: {
        title: 'Welcome to Spectrum!',
        subtitle:
          'Spectrum is a place where communities can share, discuss, and grow together. To get started, create a username.',
        emoji: '👋',
      },
      joinFirstCommunity: {
        // will be triggered if the user signed up via a community, channel, or thread view
        title: 'Join your first community',
        subtitle:
          "You were in the middle of something. Let's get back on track and join your first community!",
        emoji: '🎉',
      },
      discoverCommunities: {
        title: 'Find your people.',
        subtitle:
          'There are hundreds of communities on Spectrum to explore. Check out some of our favorites below or search for topics.',
        emoji: null,
      },
      appsUpsell: {
        title: appUpsellCopy.title,
        subtitle: appUpsellCopy.subtitle,
        emoji: null,
      },
    };

    return (
      <FullscreenView
        hasBackground
        showBackgroundOnMobile={false}
        close={this.props.close}
        noCloseButton={this.props.noCloseButton}
      >
        <OnboardingContainer>
          <OnboardingContent>
            <IconContainer>
              {steps[activeStep].emoji && (
                <Emoji>{steps[activeStep].emoji}</Emoji>
              )}
            </IconContainer>
            <Title>{steps[activeStep].title}</Title>
            <Subtitle>{steps[activeStep].subtitle}</Subtitle>

            {activeStep === 'setUsername' && (
              <SetUsername user={currentUser} save={this.saveUsername} />
            )}

            {activeStep === 'joinFirstCommunity' && (
              <JoinFirstCommunity
                community={community}
                joinedCommunity={this.joinedCommunity}
              />
            )}

            {activeStep === 'discoverCommunities' && (
              <Container>
                <Search joinedCommunity={this.joinedCommunity} />
                <TopCommunities
                  joinedCommunity={this.joinedCommunity}
                  hasJoined={joinedCommunities > 0}
                  curatedContentType={'top-communities-by-members'}
                />
                <CreateUpsellContainer extra={joinedCommunities > 0}>
                  <UpsellCreateCommunity close={this.props.close} />
                </CreateUpsellContainer>

                <StickyRow hasJoined={joinedCommunities > 0}>
                  <ContinueButton
                    style={{ marginTop: '0' }}
                    onClick={() => (window.location.href = '/')}
                  >
                    Continue to my home feed
                  </ContinueButton>
                </StickyRow>
              </Container>
            )}

            {activeStep === 'appsUpsell' && (
              <AppsUpsell
                onDownload={this.onAppDownload}
                nextStep={this.appUpsellComplete}
              />
            )}
          </OnboardingContent>
        </OnboardingContainer>
      </FullscreenView>
    );
  }
}

const map = (state): StateProps => ({
  community: state.newUserOnboarding.community,
});
export default compose(connect(map))(NewUserOnboarding);
