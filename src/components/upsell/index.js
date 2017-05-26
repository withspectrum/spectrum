// @flow
import React from 'react';
// $FlowFixMe
import { Link } from 'react-router-dom';
import Card from '../card';
import { Button, OutlineButton } from '../buttons';
import { Title, Subtitle, Actions, NullCol } from './style';
import { SERVER_URL } from '../../api';

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
        Follow ~{channel.name} to get involved!
      </Subtitle>
      <Button onClick={() => subscribe(channel.id)} icon="plus" label>
        Follow
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
        <OutlineButton onClick={() => window.location.href = returnUrl}>
          Take me back
        </OutlineButton>
        <Button onClick={() => window.location.href = '/explore'}>
          Explore Channels on Spectrum
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
          ? <OutlineButton onClick={() => window.location.href = '/explore'}>
              Explore Communities
            </OutlineButton>
          : <Button onClick={() => window.location.href = '/explore'}>
              Explore Communities
            </Button>}

        {create &&
          <Button onClick={create}>
            Create this Community
          </Button>}
      </Actions>
    </NullCard>
  );
};

export const Upsell404User = ({ username }: { username: string }) => {
  const returnUrl = `/`;
  const title = 'Oops, someone got lost!';
  const subtitle = `We can't find anyone who answers to the name ${username}. Maybe they don't want to be found...`;

  return (
    <NullCard bg="user">
      <Title>{title}</Title>
      <Subtitle>{subtitle}</Subtitle>

      <Button onClick={() => window.location.href = returnUrl}>
        Take me home
      </Button>
    </NullCard>
  );
};

export const Upsell404Thread = () => {
  const returnUrl = `/`;
  const title = 'Oops, something got lost!';
  const subtitle = `We can't find that thread. Maybe it floated off into space...`;

  return (
    <NullCard bg="post">
      <Title>{title}</Title>
      <Subtitle>{subtitle}</Subtitle>

      <Button onClick={() => window.location.href = returnUrl}>
        Take me home
      </Button>
    </NullCard>
  );
};
