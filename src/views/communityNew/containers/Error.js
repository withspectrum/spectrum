// @flow
import React from 'react';
import compose from 'recompose/compose';
import AppViewWrapper from 'src/components/appViewWrapper';
import { OutlineButton, PrimaryButton } from '../components/Button';
import {
  CenteredContainer,
  SingleColumnSection,
  Emoji,
  Heading,
  Description,
  ActionsRow,
} from '../style';

export const ErrorView = () => {
  return (
    <AppViewWrapper>
      <CenteredContainer>
        <SingleColumnSection>
          <Emoji>😣</Emoji>
          <Heading>We couldn’t load this community</Heading>
          <Description>
            The community may have been deleted or Spectrum may be running into
            problems loading it. If you think something has gone wrong, please
            contact us.
          </Description>
          <ActionsRow>
            <OutlineButton href={'mailto:hi@spectrum.chat'}>
              Contact us
            </OutlineButton>
            <PrimaryButton to={'/'}>Go home</PrimaryButton>
          </ActionsRow>
        </SingleColumnSection>
      </CenteredContainer>
    </AppViewWrapper>
  );
};
