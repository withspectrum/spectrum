// @flow
import React from 'react';
import { Button } from '../buttons';
import {
  UpsellSignInContainer,
  UpsellJoinContainer,
  Title,
  Subtitle,
  BGOne,
  BGTwo,
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
        Join {frequency.name} to start chatting with friends in this community!
      </Subtitle>
      <Button onClick={() => subscribe(frequency.id)} icon="subscribe" label>
        Follow {frequency.name} in {frequency.community.name}
      </Button>
    </UpsellJoinContainer>
  );
};
