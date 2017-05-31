// @flow
import React, { Component } from 'react';
// $FlowFixMe
import { Link } from 'react-router-dom';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import compose from 'recompose/compose';
import { SERVER_URL } from '../../api';
import { addToastWithTimeout } from '../../actions/toasts';
import Card from '../card';
import { Button, OutlineButton } from '../buttons';
import {
  Title,
  Subtitle,
  Actions,
  NullCol,
  UpgradeError,
  Profile,
  Cost,
} from './style';
// $FlowFixMe
import StripeCheckout from 'react-stripe-checkout';
import { upgradeToProMutation } from '../../api/user';

export const NullCard = props => {
  return (
    <Card>
      <NullCol bg={props.bg}>
        {props.heading && <Title>{props.heading}</Title>}
        {props.copy && <Subtitle>{props.copy}</Subtitle>}
        {props.children}
      </NullCol>
    </Card>
  );
};

export const NullState = props => (
  <NullCol bg={props.bg}>
    {props.heading && <Title>{props.heading}</Title>}
    {props.copy && <Subtitle>{props.copy}</Subtitle>}
    {props.children}
  </NullCol>
);

export const UpsellSignIn = ({ entity }) => {
  const login = () => {
    // log the user in and return them to this page
    return (window.location.href = `http://localhost:3001/auth/twitter?redirectTo=${window.location.pathname}`);
  };

  const subtitle = entity
    ? `Ready to join the conversation in ${entity.name}?`
    : 'Ready to join the conversation? ';

  return (
    <NullCard bg="chat">
      <Title>Come on in, the chatter's fine.</Title>
      <Subtitle>{subtitle}</Subtitle>
      <Button onClick={login} icon="twitter" label>Sign in with Twitter</Button>
    </NullCard>
  );
};

export const UpsellJoinChannel = ({
  channel,
  subscribe,
}: { channel: Object, subscribe: Function }) => {
  return (
    <NullCard bg="channel">
      <Title>Ready to join the conversation?</Title>
      <Subtitle>
        Join ~{channel.name} to get involved!
      </Subtitle>
      <Button onClick={() => subscribe(channel.id)} icon="plus" label>
        Join
      </Button>
    </NullCard>
  );
};

export const UpsellRequestToJoinChannel = ({
  channel,
  community,
  isPending,
  subscribe,
  currentUser,
}: {
  channel: Object,
  community: string,
  isPending: boolean,
  subscribe: Function,
  currentUser: Object,
}) => {
  return (
    <NullCard bg="locked">
      <Title>Top secret!</Title>
      <Subtitle>
        This channel is private - you may request to join
        {' '}
        <b>{channel.name}</b>
        {' '}
        or
        {' '}
        <Link to={`/${community}`}>Go back</Link>
        .
      </Subtitle>

      {// user is not logged in
      !currentUser &&
        <Button
          icon="twitter"
          onClick={() => window.location.href = `${SERVER_URL}/auth/twitter`}
        >
          Sign in with Twitter
        </Button>}

      {// has user already requested to join?
      currentUser && isPending
        ? <OutlineButton
            onClick={() => subscribe(channel.id)}
            icon="minus"
            label
          >
            Cancel request
          </OutlineButton>
        : currentUser &&
            <Button
              onClick={() => subscribe(channel.id)}
              icon="private-unlocked"
              label
            >
              Request to join {channel.name}
            </Button>}
    </NullCard>
  );
};

export const Upsell404Channel = ({
  channel,
  noPermission,
}: { channel: Object, noPermission: boolean }) => {
  // if a user doesn't have permission, it means they likely tried to view
  // the settings page for a channel. In this case, we will return
  // them to the channel view.
  // if the user does have permission, but this component gets rendered, it means
  // something went wrong - most likely the channel doesn't exists (404) so
  // we should return the user back to the community url
  const returnUrl = noPermission
    ? `/${channel.community}/${channel.slug}`
    : `/${channel.community}`;

  const title = noPermission
    ? "I see you sneakin' around here..."
    : 'Oops, something got lost!';

  const subtitle = noPermission
    ? "You'll have to get permission (or be 1337) to get access."
    : `We can't find a channel by the name of ${channel.name}.`;

  return (
    <NullCard bg={noPermission ? 'locked' : 'channel'}>
      <Title>{title}</Title>
      <Subtitle>{subtitle}</Subtitle>
      <Actions>
        <Button onClick={() => window.location.href = returnUrl}>
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
}: { community: string, noPermission: boolean, create: Function }) => {
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
      <Title>{title}</Title>
      <Subtitle>{subtitle}</Subtitle>

      <Actions>
        {// de-emphasizes the 'take me home' button if a create prompt is shown
        create
          ? <Link to={`/home`}>
              <OutlineButton>
                Take me home
              </OutlineButton>
            </Link>
          : <Link to={`/home`}>
              <Button>
                Take me home
              </Button>
            </Link>}

        {create &&
          <Button onClick={create}>
            Create this Community
          </Button>}
      </Actions>
    </NullCard>
  );
};

export const UpsellJoinCommunity = ({
  community,
  join,
}: { community: Object, join: Function }) => {
  return (
    <NullCard
      bg="chat"
      heading="Want to be a part of the conversation?"
      copy={`Join ${community.name} to get involved!`}
    >
      <Button onClick={() => join(community.id)} icon="plus">
        Join {community.name}
      </Button>
    </NullCard>
  );
};

export const Upsell404User = ({
  username,
  noPermission,
}: { username: string, noPermission: boolean }) => {
  const title = noPermission
    ? "I see you sneakin' around here..."
    : `${username}? What's a ${username}?`;
  const subtitle = noPermission
    ? `But, that's not for you...`
    : `We don't know anyone who goes by that name. Sorry!`;

  return (
    <NullCard bg="user" heading={title} copy={subtitle}>
      <Button onClick={() => window.location.href = '/home'}>
        Take me home
      </Button>
    </NullCard>
  );
};

export const Upsell404Thread = () => {
  return (
    <NullCard
      bg="post"
      heading="Oops, something got lost!"
      copy="We can't find that thread. Maybe it floated off into space..."
    >
      <Button onClick={() => window.location.href = `/home`}>
        Take me home
      </Button>
    </NullCard>
  );
};

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
      <NullCard bg="pro">
        <Profile>
          <img
            alt={currentUser.name}
            src={`${currentUser.profilePhoto}?w=48&dpr=2`}
          />
          <span>PRO</span>
        </Profile>
        <Title>Upgrade to Pro</Title>
        <Subtitle>
          We're hard at work building features for Spectrum Pro. Your early support helps us get there faster – thank you!
        </Subtitle>
        <Cost>Spectrum Pro costs $5/month and you can cancel at any time.</Cost>
        <StripeCheckout
          token={this.upgradeToPro}
          stripeKey={'pk_test_A6pKi4xXOdgg9FrZJ84NW9mP'}
          name="🔐   Pay Securely"
          description="Secured and Encrypted by Stripe"
          panelLabel="Subscribe for "
          amount={500}
          currency="USD"
        >
          <Button disabled={isLoading} loading={isLoading} icon="payment">
            Upgrade
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
  connect(mapStateToProps)
)(UpsellUpgradeToProPure);
