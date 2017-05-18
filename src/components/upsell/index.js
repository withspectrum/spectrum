// @flow
import React from 'react';
// $FlowFixMe
import { Link } from 'react-router-dom';
import { Button, OutlineButton } from '../buttons';
import {
  UpsellSignInContainer,
  UpsellFourOhFourContainer,
  UpsellJoinContainer,
  Title,
  Subtitle,
  BGOne,
  BGTwo,
  FourOhFourImage,
  Actions,
} from './style';

export const UpsellSignIn = ({ entity }) => {
  const login = () => {
    // log the user in and return them to this page
    return (window.location.href = `http://localhost:3001/auth/twitter?redirectTo=${window.location.pathname}`);
  };

  const subtitle = entity
    ? `Ready to join the conversation in ${entity.name}? Sign in to get started!`
    : 'Ready to join the conversation? Sign in to get started!';

  return (
    <UpsellSignInContainer>
      <BGOne src="/img/cluster-2.svg" role="presentation" />
      <BGTwo src="/img/cluster-1.svg" role="presentation" />
      <Title>Come on in, the chatter's fine.</Title>
      <Subtitle>{subtitle}</Subtitle>
      <Button onClick={login} icon="twitter" label>Sign in with Twitter</Button>
    </UpsellSignInContainer>
  );
};

export const UpsellJoinFrequency = ({ frequency, subscribe }) => {
  return (
    <UpsellJoinContainer>
      <BGOne src="/img/cluster-2.svg" role="presentation" />
      <BGTwo src="/img/cluster-1.svg" role="presentation" />
      <Title>Ready to join the conversation?</Title>
      <Subtitle>
        Follow ~{frequency.name} to get involved!
      </Subtitle>
      <Button onClick={() => subscribe(frequency.id)} icon="plus" label>
        Follow
      </Button>
    </UpsellJoinContainer>
  );
};

export const UpsellRequestToJoinFrequency = ({
  frequency,
  community,
  isPending,
  subscribe,
}) => {
  return (
    <UpsellFourOhFourContainer>
      <BGOne src="/img/cluster-2.svg" role="presentation" />
      <BGTwo src="/img/cluster-1.svg" role="presentation" />
      <Title>Top secret!</Title>
      <Subtitle>
        This is a private channel - you may request to join
        {' '}
        <b>{frequency.name}</b>
        {' '}
        or
        {' '}
        <Link to={`/${community}`}>go back</Link>
        .
      </Subtitle>

      {// has user already requested to join?
      isPending
        ? <OutlineButton
            onClick={() => subscribe(frequency.id)}
            icon="unsubscribe"
            label
          >
            Cancel request
          </OutlineButton>
        : <Button onClick={() => subscribe(frequency.id)} icon="plus" label>
            Request to join {frequency.name}
          </Button>}
    </UpsellFourOhFourContainer>
  );
};

export const Upsell404Frequency = ({ frequency, community, noPermission }) => {
  // if a user doesn't have permission, it means they likely tried to view
  // the settings page for a frequency. In this case, we will return
  // them to the frequency view.
  // if the user does have permission, but this component gets rendered, it means
  // something went wrong - most likely the frequency doesn't exists (404) so
  // we should return the user back to the community url
  const returnUrl = noPermission
    ? `/${community}/${frequency}`
    : `/${community}`;

  const title = noPermission
    ? "I see you sneakin' around here..."
    : 'Oops, something got lost!';

  const subtitle = noPermission
    ? 'This is a no-fly-zone for you, sorry! Head on back out now, hear?'
    : `We can't find a frequency by the name of ${frequency}.`;

  return (
    <UpsellFourOhFourContainer>
      <FourOhFourImage src="/img/login.svg" role="presentation" />
      <Title>{title}</Title>
      <Subtitle>{subtitle}</Subtitle>
      <Button onClick={() => window.location.href = returnUrl}>
        Take me back
      </Button>
    </UpsellFourOhFourContainer>
  );
};

export const Upsell404Community = ({ community, noPermission, create }) => {
  // if a user doesn't have permission, it means they likely tried to view
  // the settings page for a community. In this case, we will return
  // them to the community view.
  // if the user does have permission, but this component gets rendered, it means
  // something went wrong - most likely the community doesn't exists (404) so
  // we should return the user back to homepage
  const returnUrl = noPermission ? `/${community}` : `/`;

  const title = noPermission
    ? "I see you sneakin' around here..."
    : 'Oops, something got lost!';

  const subtitle = noPermission
    ? 'This is a no-fly-zone for you, sorry! Head on back out now, hear?'
    : `We can't find a community by the name of ${community}. Want to make one?`;

  return (
    <UpsellFourOhFourContainer>
      <FourOhFourImage src="/img/login.svg" role="presentation" />
      <Title>{title}</Title>
      <Subtitle>{subtitle}</Subtitle>

      <Actions>
        {// de-emphasizes the 'take me home' button if a create prompt is shown
        create
          ? <OutlineButton onClick={() => window.location.href = returnUrl}>
              Take Me Home
            </OutlineButton>
          : <Button onClick={() => window.location.href = returnUrl}>
              Take Me Home
            </Button>}

        {create &&
          <Button onClick={create}>
            Create this Community
          </Button>}
      </Actions>
    </UpsellFourOhFourContainer>
  );
};

export const Upsell404User = ({ username }) => {
  const returnUrl = `/`;
  const title = 'Oops, someone got lost!';
  const subtitle = `We can't find anyone who answers to the name ${username}. Maybe they don't want to be found...`;

  return (
    <UpsellFourOhFourContainer>
      <FourOhFourImage src="/img/login.svg" role="presentation" />
      <Title>{title}</Title>
      <Subtitle>{subtitle}</Subtitle>

      <Button onClick={() => window.location.href = returnUrl}>
        Take me home
      </Button>
    </UpsellFourOhFourContainer>
  );
};

export const Upsell404Story = () => {
  const returnUrl = `/`;
  const title = 'Oops, something got lost!';
  const subtitle = `We can't find that thread. Maybe it floated off into space...`;

  return (
    <UpsellFourOhFourContainer>
      <FourOhFourImage src="/img/login.svg" role="presentation" />
      <Title>{title}</Title>
      <Subtitle>{subtitle}</Subtitle>

      <Button onClick={() => window.location.href = returnUrl}>
        Take me home
      </Button>
    </UpsellFourOhFourContainer>
  );
};
