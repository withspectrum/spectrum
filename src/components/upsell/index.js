// @flow
import * as React from 'react';
import Link from 'src/components/link';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Icon from '../../components/icons';
import { storeItem } from '../../helpers/localStorage';
import { PUBLIC_STRIPE_KEY } from '../../api/constants';
import { addToastWithTimeout } from '../../actions/toasts';
import { openModal } from '../../actions/modals';
import Avatar from '../avatar';
import ToggleCommunityMembership from '../toggleCommunityMembership';
import { Button, OutlineButton } from '../buttons';
import { Login } from '../../views/login';
import type { GetCommunityType } from 'shared/graphql/queries/community/getCommunity';
import {
  Title,
  MiniTitle,
  Subtitle,
  MiniSubtitle,
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
} from './style';
import StripeCheckout from 'react-stripe-checkout';
import upgradeToProMutation from 'shared/graphql/mutations/user/upgradeToPro';

type NullCardProps = {
  noShadow?: boolean,
  noPadding?: boolean,
  bg?: ?string,
  heading?: string,
  copy?: string,
  children?: React.Node,
  repeat?: boolean,
  emoji?: string,
};
export const NullCard = (props: NullCardProps) => {
  return (
    <NullCol bg={props.bg} repeat={props.repeat} noPadding={props.noPadding}>
      {props.heading && <Title>{props.heading}</Title>}
      {props.copy && <Subtitle>{props.copy}</Subtitle>}
      {props.children}
    </NullCol>
  );
};

export const MiniNullCard = (props: NullCardProps) => {
  return (
    <NullCol bg={props.bg} repeat={props.repeat} noPadding={props.noPadding}>
      {props.emoji && (
        <LargeEmoji>
          <span role="img" aria-label="Howdy!">
            {props.emoji}
          </span>
        </LargeEmoji>
      )}
      {props.heading && <MiniTitle>{props.heading}</MiniTitle>}
      {props.copy && <MiniSubtitle>{props.copy}</MiniSubtitle>}
      {props.children}
    </NullCol>
  );
};

type NullStateProps = {
  bg?: ?string,
  heading?: string,
  copy?: string,
  children?: React.Node,
};
export const NullState = (props: NullStateProps) => (
  <NullCol bg={props.bg}>
    {props.heading && <Title>{props.heading}</Title>}
    {props.copy && <Subtitle>{props.copy}</Subtitle>}
    {props.children}
  </NullCol>
);

export const UpsellMiniCreateCommunity = () => {
  return (
    <MiniNullCard
      bg="onboarding"
      heading="Create a community"
      copy="Building communities on Spectrum is easy and free forever"
    >
      <Link to="/new/community">
        <Button icon="plus">Get Started</Button>
      </Link>
    </MiniNullCard>
  );
};

// takes a 'close' props from the new user onboarding which allows a user
// to create a community rather than joining communities - if they choose
// to go down the path of creating a community, clicking on the 'get started'
// button will close the new user onboarding
export const UpsellCreateCommunity = ({ close }: { close: Function }) => {
  const title = 'Create a community';
  const subtitle = 'Building communities on Spectrum is easy and free forever';

  return (
    <NullCard bg={'onboarding'}>
      <Title>{title}</Title>
      <Subtitle>{subtitle}</Subtitle>
      <Actions>
        <Link to="/new/community">
          <Button onClick={close}>Get Started</Button>
        </Link>
      </Actions>
    </NullCard>
  );
};

type SigninState = {
  isSigningIn: boolean,
  signinType: string,
};

type SigninProps = {
  view?: Object,
  noShadow?: boolean,
  title?: string,
  glyph?: string,
  redirectPath?: string,
};

export class UpsellSignIn extends React.Component<SigninProps, SigninState> {
  state = {
    isSigningIn: false,
    signinType: '',
  };

  toggleSigningIn = (type: string) => {
    const { isSigningIn } = this.state;
    this.setState({
      isSigningIn: !isSigningIn,
      signinType: type,
    });
  };

  trackSignin = (type: string, method: string) => {
    storeItem('preferred_signin_method', method);
  };

  render() {
    const { view, noShadow, title, glyph } = this.props;
    const { isSigningIn, signinType } = this.state;

    if (isSigningIn) {
      return (
        <Login
          close={this.toggleSigningIn}
          signinType={signinType}
          redirectPath={window.location}
        />
      );
    } else {
      const subtitle = view
        ? view.type === 'community'
          ? `Spectrum is a place where communities can share, discuss, and grow together. Sign up to join the ${
              view.data.name
            } community and get in on the conversation.`
          : `Spectrum is a place where communities can share, discuss, and grow together. Sign up to join the ${
              view.data.community.name
            } community and get in on the conversation.`
        : 'Spectrum is a place where communities can share, discuss, and grow together. Sign up below to get in on the conversation.';

      return (
        <NullCard bg={'signup'} noPadding noShadow={noShadow}>
          <UpsellIconContainer>
            <Icon glyph={glyph || 'explore'} size={56} />
          </UpsellIconContainer>
          <Title>{title || 'Find your people.'}</Title>
          <Subtitle>{subtitle}</Subtitle>

          <SignupButton onClick={() => this.toggleSigningIn('signup')}>
            Sign up
          </SignupButton>
          <SignupFooter>
            Already have an account?{' '}
            <SigninLink onClick={() => this.toggleSigningIn('login')}>
              {' '}
              Log in
            </SigninLink>
          </SignupFooter>
        </NullCard>
      );
    }
  }
}

export const Upsell404Channel = ({ community }: { community: string }) => {
  return (
    <Actions>
      <Link to={`/${community}`}>
        <Button large>Take me back</Button>
      </Link>
    </Actions>
  );
};

export const Upsell404Community = () => {
  // if a user doesn't have permission, it means they likely tried to view
  // the settings page for a community. In this case, we will return
  // them to the community view.
  // if the user does have permission, but this component gets rendered, it means
  // something went wrong - most likely the community doesn't exists (404) so
  // we should return the user back to homepage
  return (
    <Actions>
      <Link to={'/'}>
        <OutlineButton large>Take me back</OutlineButton>
      </Link>

      <Link to={'/new/community'}>
        <Button large>Create a community</Button>
      </Link>
    </Actions>
  );
};

export const UpsellJoinCommunity = ({
  community,
}: {
  community: GetCommunityType,
}) => {
  return (
    <NullCard
      bg="chat"
      heading="Want to be a part of the conversation?"
      copy={`Join ${community.name} to get involved!`}
    >
      <ToggleCommunityMembership
        community={community}
        render={({ isLoading }) => (
          <Button loading={isLoading} icon="plus">
            Join {community.name}
          </Button>
        )}
      />
    </NullCard>
  );
};

type NewUserProps = {
  user: {
    name: string,
  },
};
export class UpsellNewUser extends React.Component<NewUserProps> {
  render() {
    const { user } = this.props;

    return (
      <NullCard bg="pro">
        <LargeEmoji>
          <span role="img" aria-label="Howdy!">
            👋
          </span>
        </LargeEmoji>
        <Title>Howdy, {user.name}!</Title>
        <Subtitle>
          Spectrum is a place where communities live. It’s easy to follow the
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
      <Button onClick={() => (window.location.href = '/home')}>
        Take me home
      </Button>
    </NullCard>
  );
};

type MiniUpgradeProps = {
  currentUser: Object,
  dispatch: Function,
};
class UpsellMiniUpgradePure extends React.Component<MiniUpgradeProps> {
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
          onClick={() =>
            dispatch(openModal('UPGRADE_MODAL', { user: currentUser }))
          }
        >
          Upgrade
        </Button>
      </MiniNullCard>
    );
  }
}

const map = state => ({ currentUser: state.users.currentUser });
// $FlowIssue
export const UpsellMiniUpgrade = connect(map)(UpsellMiniUpgradePure);

type UpgradeProProps = {
  upgradeToPro: Function,
  complete: Function,
  dispatch: Function,
  currentUser: Object,
};

type UpgradeProState = {
  upgradeError: string,
  isLoading: boolean,
};
class UpsellUpgradeToProPure extends React.Component<
  UpgradeProProps,
  UpgradeProState
> {
  state = {
    upgradeError: '',
    isLoading: false,
  };

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
      .then(() => {
        this.props.dispatch(addToastWithTimeout('success', 'Upgraded to Pro!'));
        this.setState({
          isLoading: false,
          upgradeError: '',
        });
        // if the upgrade is triggered from a modal, close the modal
        return this.props.complete && this.props.complete();
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
          <Avatar src={`${currentUser.profilePhoto}`} user={currentUser} />
          <span>PRO</span>
        </Profile>
        <Title>Upgrade to Pro</Title>
        <Subtitle>
          We’re hard at work building features for Spectrum Pro. Your early
          support helps us get there faster – thank you! In the meantime, here’s
          what’s unlocked on Pro:
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

        {!upgradeError && <UpgradeError>{upgradeError}</UpgradeError>}
      </NullCard>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});
export const UpsellUpgradeToPro = compose(
  upgradeToProMutation,
  // $FlowIssue
  connect(mapStateToProps)
)(UpsellUpgradeToProPure);

export const UpsellNullNotifications = () => {
  return (
    <NullCard bg="notification" heading="You don't have any notifications yet.">
      <Link to="/">
        <Button icon="home">Take Me Home</Button>
      </Link>
    </NullCard>
  );
};

export const UpsellReload = () => (
  <NullCard
    bg="error"
    heading={'Whoops!'}
    copy={'Something went wrong on our end... Mind reloading?'}
  >
    <Button icon="view-reload" onClick={() => window.location.reload(true)}>
      Reload
    </Button>
  </NullCard>
);
