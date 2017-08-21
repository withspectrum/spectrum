// @flow
import React, { Component } from 'react';
// $FlowFixMe
import { Link } from 'react-router-dom';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import compose from 'recompose/compose';
import Icon from '../../components/icons';
import FullscreenView from '../../components/fullscreenView';
import { getItemFromStorage, storeItem } from '../../helpers/localStorage';
import { SERVER_URL, PUBLIC_STRIPE_KEY } from '../../api/constants';
import { addToastWithTimeout } from '../../actions/toasts';
import { openModal } from '../../actions/modals';
import { Avatar } from '../avatar';
import Card from '../card';
import { Button, OutlineButton } from '../buttons';
import {
  Title,
  MiniTitle,
  LargeTitle,
  Subtitle,
  MiniSubtitle,
  LargeSubtitle,
  Actions,
  NullCol,
  UpgradeError,
  Profile,
  Cost,
  LargeEmoji,
  UpsellIconContainer,
  SignupButton,
  SignupFooter,
  SigninLink,
  FullscreenContent,
  CodeOfConduct,
  SigninButtonsContainer,
  ButtonTwitter,
  ButtonFacebook,
  ButtonGoogle,
  Col,
} from './style';
// $FlowFixMe
import StripeCheckout from 'react-stripe-checkout';
import { upgradeToProMutation } from '../../api/user';

export const NullCard = props => {
  return (
    <Card noShadow={props.noShadow}>
      <NullCol bg={props.bg} repeat={props.repeat} noPadding={props.noPadding}>
        {props.heading &&
          <Title>
            {props.heading}
          </Title>}
        {props.copy &&
          <Subtitle>
            {props.copy}
          </Subtitle>}
        {props.children}
      </NullCol>
    </Card>
  );
};

export const MiniNullCard = props => {
  return (
    <Card>
      <NullCol bg={props.bg} repeat={props.repeat} noPadding={props.noPadding}>
        {props.emoji &&
          <LargeEmoji>
            <span role="img" aria-label="Howdy!">
              {props.emoji}
            </span>
          </LargeEmoji>}
        {props.heading &&
          <MiniTitle>
            {props.heading}
          </MiniTitle>}
        {props.copy &&
          <MiniSubtitle>
            {props.copy}
          </MiniSubtitle>}
        {props.children}
      </NullCol>
    </Card>
  );
};

export const NullState = props =>
  <NullCol bg={props.bg}>
    {props.heading &&
      <Title>
        {props.heading}
      </Title>}
    {props.copy &&
      <Subtitle>
        {props.copy}
      </Subtitle>}
    {props.children}
  </NullCol>;

const login = method => {
  // log the user in and return them to this page
  storeItem('preferred_signin_method', method);
};

export const UpsellMiniCreateCommunity = () => {
  return (
    <MiniNullCard
      bg="onboarding"
      heading="Create a community"
      copy="Building communities on Spectrum is easy and free forever"
    >
      <Link to="/new/community">
        <Button icon="plus" label>
          Get Started
        </Button>
      </Link>
    </MiniNullCard>
  );
};

// takes a 'close' props from the new user onboarding which allows a user
// to create a community rather than joining communities - if they choose
// to go down the path of creating a community, clicking on the 'get started'
// button will close the new user onboarding
export const UpsellCreateCommunity = ({ close }) => {
  const title = 'Create a community';
  const subtitle = 'Building communities on Spectrum is easy and free forever';

  return (
    <NullCard bg={'onboarding'}>
      <Title>
        {title}
      </Title>
      <Subtitle>
        {subtitle}
      </Subtitle>
      <Actions>
        <Link to="/new/community">
          <Button onClick={close}>Get Started</Button>
        </Link>
      </Actions>
    </NullCard>
  );
};

export class UpsellSignIn extends Component {
  state: {
    isSigningIn: Boolean,
    signinType: string,
  };

  constructor() {
    super();

    this.state = {
      isSigningIn: false,
      signinType: '',
    };
  }

  toggleSigningIn = type => {
    const { isSigningIn } = this.state;
    this.setState({
      isSigningIn: !isSigningIn,
      signinType: type,
    });
  };

  trackSignin = (type, method) => {
    storeItem('preferred_signin_method', method);
  };

  render() {
    const { view, noShadow, title, glyph } = this.props;
    const { isSigningIn, signinType } = this.state;
    const preferredSigninMethod = getItemFromStorage('preferred_signin_method');

    if (isSigningIn) {
      const title =
        signinType === 'signup' ? 'Good times ahead!' : 'Welcome back!';
      const subtitle =
        signinType === 'signup'
          ? 'Spectrum is a place where communities can share, discuss, and grow together. Sign in below to get in on the conversation.'
          : "We're happy to see you again - log in below to get back into the conversation!";
      const verb = signinType === 'signup' ? 'Sign up' : 'Log in';

      return (
        <FullscreenView hasBackground close={this.toggleSigningIn}>
          <FullscreenContent>
            <UpsellIconContainer>
              <Icon glyph={'emoji'} size={64} />
            </UpsellIconContainer>
            <LargeTitle>
              {title}
            </LargeTitle>
            <LargeSubtitle>
              {subtitle}
            </LargeSubtitle>

            <SigninButtonsContainer noShadow>
              {preferredSigninMethod &&
                <Col>
                  <ButtonTwitter
                    preferred={preferredSigninMethod === 'twitter'}
                    after={preferredSigninMethod === 'twitter'}
                    whitebg={preferredSigninMethod !== 'twitter'}
                    href={`${SERVER_URL}/auth/twitter?r=${window.location
                      .href}`}
                    onClick={() => this.trackSignin('secondary cta', 'twitter')}
                  >
                    <Icon glyph="twitter" /> <span>{verb} with Twitter</span>
                  </ButtonTwitter>

                  <ButtonFacebook
                    preferred={preferredSigninMethod === 'facebook'}
                    after={preferredSigninMethod === 'facebook'}
                    whitebg={preferredSigninMethod !== 'facebook'}
                    href={`${SERVER_URL}/auth/facebook?r=${window.location
                      .href}`}
                    onClick={() =>
                      this.trackSignin('secondary cta', 'facebook')}
                  >
                    <Icon glyph="facebook" /> <span>{verb} with Facebook</span>
                  </ButtonFacebook>

                  <ButtonGoogle
                    preferred={preferredSigninMethod === 'google'}
                    after={preferredSigninMethod === 'google'}
                    whitebg={preferredSigninMethod !== 'google'}
                    href={`${SERVER_URL}/auth/google?r=${window.location.href}`}
                    onClick={() => this.trackSignin('secondary cta', 'google')}
                  >
                    <Icon glyph="google" /> <span>{verb} with Google</span>
                  </ButtonGoogle>
                </Col>}

              {!preferredSigninMethod &&
                <Col>
                  <ButtonTwitter
                    preferred
                    href={`${SERVER_URL}/auth/twitter?r=${window.location
                      .href}`}
                    after={preferredSigninMethod === 'twitter'}
                    onClick={() => this.trackSignin('secondary cta', 'twitter')}
                  >
                    <Icon glyph="twitter" /> <span>{verb} with Twitter</span>
                  </ButtonTwitter>

                  <ButtonFacebook
                    preferred
                    href={`${SERVER_URL}/auth/facebook?r=${window.location
                      .href}`}
                    after={preferredSigninMethod === 'facebook'}
                    onClick={() =>
                      this.trackSignin('secondary cta', 'facebook')}
                  >
                    <Icon glyph="facebook" /> <span>{verb} with Facebook</span>
                  </ButtonFacebook>

                  <ButtonGoogle
                    preferred
                    href={`${SERVER_URL}/auth/google?r=${window.location.href}`}
                    after={preferredSigninMethod === 'google'}
                    onClick={() => this.trackSignin('secondary cta', 'google')}
                  >
                    <Icon glyph="google" /> <span>{verb} with Google</span>
                  </ButtonGoogle>
                </Col>}
            </SigninButtonsContainer>

            <CodeOfConduct>
              By using Spectrum, you agree to our{' '}
              <a
                href="https://github.com/withspectrum/code-of-conduct"
                target="_blank"
                rel="noopener noreferrer"
              >
                Code of Conduct
              </a>
            </CodeOfConduct>
          </FullscreenContent>
        </FullscreenView>
      );
    } else {
      const subtitle = view
        ? view.type === 'community'
          ? `Spectrum is a place where communities can share, discuss, and grow together. Sign up to join the ${view
              .data.name} community and get in on the conversation.`
          : `Spectrum is a place where communities can share, discuss, and grow together. Sign up to join the ${view
              .data.community.name} community and get in on the conversation.`
        : 'Spectrum is a place where communities can share, discuss, and grow together. Sign up below to get in on the conversation.';

      return (
        <NullCard bg={'signup'} noPadding noShadow={noShadow}>
          <UpsellIconContainer>
            <Icon glyph={glyph || 'explore'} size={56} />
          </UpsellIconContainer>
          <Title>
            {title || 'Find your people.'}
          </Title>
          <Subtitle>
            {subtitle}
          </Subtitle>

          <SignupButton onClick={() => this.toggleSigningIn('signup')}>
            Sign up
          </SignupButton>
          <SignupFooter>
            Already have an account?{' '}
            <SigninLink onClick={() => this.toggleSigningIn('login')}>
              {' '}Log in
            </SigninLink>
          </SignupFooter>
        </NullCard>
      );
    }
  }
}

export const UpsellJoinChannelState = ({
  channel,
  subscribe,
  loading,
}: {
  channel: Object,
  subscribe: Function,
}) => {
  return (
    <NullState bg="channel">
      <Title>Ready to join the conversation?</Title>
      <Subtitle>
        Join ~{channel.name} to get involved!
      </Subtitle>
      <Button
        loading={loading}
        onClick={() => subscribe(channel.id)}
        icon="plus"
        label
      >
        Join
      </Button>
    </NullState>
  );
};

export const UpsellRequestToJoinChannel = ({
  channel,
  community,
  isPending,
  subscribe,
  currentUser,
  loading,
}: {
  channel: Object,
  community: string,
  isPending: boolean,
  subscribe: Function,
  currentUser: Object,
  loading: boolean,
}) => {
  return (
    <NullCard bg="locked">
      <Title>Top secret!</Title>
      <Subtitle>
        This channel is private - you may request to join <b>{channel.name}</b>{' '}
        or <Link to={`/${community}`}>Go back</Link>
        .
      </Subtitle>

      {// user is not logged in
      !currentUser &&
        <Button icon="twitter" onClick={login}>
          Sign in with Twitter
        </Button>}

      {// has user already requested to join?
      currentUser && isPending
        ? <OutlineButton
            onClick={() => subscribe(channel.id)}
            icon="minus"
            loading={loading}
            label
          >
            Cancel request
          </OutlineButton>
        : currentUser &&
          <Button
            onClick={() => subscribe(channel.id)}
            icon="private-unlocked"
            loading={loading}
            label
          >
            Request to join {channel.name}
          </Button>}
    </NullCard>
  );
};

export const Upsell404Channel = ({
  channel,
  community,
  noPermission,
}: {
  channel: Object,
  noPermission: boolean,
}) => {
  // if a user doesn't have permission, it means they likely tried to view
  // the settings page for a channel. In this case, we will return
  // them to the channel view.
  // if the user does have permission, but this component gets rendered, it means
  // something went wrong - most likely the channel doesn't exists (404) so
  // we should return the user back to the community url
  const returnUrl = noPermission ? `/${community}/${channel}` : `/${community}`;

  const title = noPermission
    ? "I see you sneakin' around here..."
    : 'Oops, something got lost!';

  const subtitle = noPermission
    ? "You'll have to get permission (or be 1337) to get access."
    : `We can't find a channel by the name of ${channel.name}.`;

  return (
    <NullCard bg={noPermission ? 'locked' : 'channel'}>
      <Title>
        {title}
      </Title>
      <Subtitle>
        {subtitle}
      </Subtitle>
      <Actions>
        <Button onClick={() => (window.location.href = returnUrl)}>
          Take me back
        </Button>
      </Actions>
    </NullCard>
  );
};

export const Upsell404Community = ({
  community,
  noPermission,
  create,
}: {
  community: string,
  noPermission: boolean,
  create: Function,
}) => {
  // if a user doesn't have permission, it means they likely tried to view
  // the settings page for a community. In this case, we will return
  // them to the community view.
  // if the user does have permission, but this component gets rendered, it means
  // something went wrong - most likely the community doesn't exists (404) so
  // we should return the user back to homepage

  const title = noPermission
    ? "I see you sneakin' around here..."
    : 'Oops, something got lost!';

  const subtitle = noPermission
    ? "You'll have to get permission (or be 1337) to get access."
    : `We can't find a community by the name of ${community}. Want to make one?`;

  return (
    <NullCard bg={noPermission ? 'locked' : 'channel'}>
      <Title>
        {title}
      </Title>
      <Subtitle>
        {subtitle}
      </Subtitle>

      <Actions>
        {// de-emphasizes the 'take me home' button if a create prompt is shown
        create
          ? <Link to={`/home`}>
              <OutlineButton>Take me home</OutlineButton>
            </Link>
          : <Link to={`/home`}>
              <Button>Take me home</Button>
            </Link>}

        {create && <Button onClick={create}>Create this Community</Button>}
      </Actions>
    </NullCard>
  );
};

export const UpsellJoinCommunity = ({
  community,
  join,
  loading,
}: {
  community: Object,
  join: Function,
}) => {
  return (
    <NullCard
      bg="chat"
      heading="Want to be a part of the conversation?"
      copy={`Join ${community.name} to get involved!`}
    >
      <Button loading={loading} onClick={() => join(community.id)} icon="plus">
        Join {community.name}
      </Button>
    </NullCard>
  );
};

export const Upsell404User = ({
  username,
  noPermission,
}: {
  username: string,
  noPermission: boolean,
}) => {
  const title = noPermission
    ? "I see you sneakin' around here..."
    : `${username}? What's a ${username}?`;
  const subtitle = noPermission
    ? `But, that's not for you...`
    : `We don't know anyone who goes by that name. Sorry!`;

  return (
    <NullCard bg="user" heading={title} copy={subtitle}>
      <Button onClick={() => (window.location.href = '/home')}>
        Take me home
      </Button>
    </NullCard>
  );
};

export class UpsellNewUser extends Component {
  render() {
    const { user } = this.props;

    return (
      <NullCard bg="pro">
        <LargeEmoji>
          <span role="img" aria-label="Howdy!">
            👋
          </span>
        </LargeEmoji>
        <Title>
          Howdy, {user.name}!
        </Title>
        <Subtitle>
          Spectrum is a place where communities live. It's easy to follow the
          things that you care about most, or even create your own community to
          share with the world.
        </Subtitle>
      </NullCard>
    );
  }
}

export const Upsell404Thread = () => {
  return (
    <NullCard
      bg="post"
      heading="Oops, something got lost!"
      copy="We can't find that thread. Maybe it floated off into space..."
    >
      <Button onClick={() => (window.location.href = `/home`)}>
        Take me home
      </Button>
    </NullCard>
  );
};

class UpsellMiniUpgradePure extends Component {
  render() {
    const { currentUser, dispatch } = this.props;

    return (
      <MiniNullCard
        bg="null"
        heading="Upgrade to Pro"
        copy="Upgrade to Pro for badges, gif avatars, and more!"
        emoji="😍"
      >
        <Button
          icon="payment"
          label
          onClick={() =>
            dispatch(openModal('UPGRADE_MODAL', { user: currentUser }))}
        >
          Upgrade
        </Button>
      </MiniNullCard>
    );
  }
}

const map = state => ({ currentUser: state.users.currentUser });
export const UpsellMiniUpgrade = connect(map)(UpsellMiniUpgradePure);

class UpsellUpgradeToProPure extends Component {
  state: {
    upgradeError: string,
    isLoading: boolean,
  };

  constructor() {
    super();

    this.state = {
      upgradeError: '',
      isLoading: false,
    };
  }

  upgradeToPro = token => {
    this.setState({
      isLoading: true,
    });

    const input = {
      plan: 'beta-pro',
      token: JSON.stringify(token),
    };

    this.props
      .upgradeToPro(input)
      .then(({ data: { upgradeToPro }, data }) => {
        this.props.dispatch(addToastWithTimeout('success', 'Upgraded to Pro!'));
        this.setState({
          isLoading: false,
          upgradeError: '',
        });
        // if the upgrade is triggered from a modal, close the modal
        this.props.complete && this.props.complete();
      })
      .catch(err => {
        this.setState({
          isLoading: false,
          upgradeError: err.message,
        });
        this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const { upgradeError, isLoading } = this.state;
    const { currentUser } = this.props;

    return (
      <NullCard bg="onboarding">
        <Profile>
          <Avatar src={`${currentUser.profilePhoto}`} />
          <span>PRO</span>
        </Profile>
        <Title>Upgrade to Pro</Title>
        <Subtitle>
          We're hard at work building features for Spectrum Pro. Your early
          support helps us get there faster – thank you! In the meantime, here's
          what's unlocked on Pro:
        </Subtitle>
        <Subtitle>
          <ul>
            <li>
              <span role="img" aria-label="sparkle emoji">
                ✨
              </span>{' '}
              A spiffy new Pro badge will adorn your name everywhere on Spectrum
            </li>
            <li>
              <span role="img" aria-label="smile with heart eyes emoji">
                😍
              </span>{' '}
              Set a gif as your profile photo or cover photo
            </li>
            <li>
              <span role="img" aria-label="tools emoji">
                🛠
              </span>{' '}
              Upload images up to 25mb, making sharing work easier
            </li>
            <li>
              <span role="img" aria-label="heart emoji">
                ❤️
              </span>{' '}
              More to come!
            </li>
          </ul>
        </Subtitle>
        <Cost>Spectrum Pro costs $5/month and you can cancel at any time.</Cost>
        <StripeCheckout
          token={this.upgradeToPro}
          stripeKey={PUBLIC_STRIPE_KEY}
          name="🔐   Pay Securely"
          description="Secured and Encrypted by Stripe"
          panelLabel="Subscribe for "
          amount={500}
          currency="USD"
        >
          <Button disabled={isLoading} loading={isLoading} icon="payment">
            Make me a Pro!
          </Button>
        </StripeCheckout>

        {!upgradeError &&
          <UpgradeError>
            {upgradeError}
          </UpgradeError>}
      </NullCard>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});
export const UpsellUpgradeToPro = compose(
  upgradeToProMutation,
  connect(mapStateToProps)
)(UpsellUpgradeToProPure);

export const UpsellToReload = () => {
  return (
    <NullCard
      bg="error"
      heading="Whoops! Someone done goofed."
      copy="Mind reloading?"
    >
      <Button icon="view-reload" onClick={() => window.location.reload(true)}>
        Reload
      </Button>
    </NullCard>
  );
};

export const UpsellNullNotifications = () => {
  return (
    <NullCard bg="notification" heading="You don't have any notifications yet.">
      <Link to="/">
        <Button icon="home">Take Me Home</Button>
      </Link>
    </NullCard>
  );
};

export const UpsellReload = () =>
  <NullCard
    bg="error"
    heading={`Whoops!`}
    copy={`Something went wrong on our end... Mind reloading?`}
  >
    <Button icon="view-reload" onClick={() => window.location.reload(true)}>
      Reload
    </Button>
  </NullCard>;
