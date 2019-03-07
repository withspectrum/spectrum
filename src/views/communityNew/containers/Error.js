// @flow
import React from 'react';
import { OutlineButton, PrimaryButton } from '../components/Button';
import { Emoji, Heading, Description, ActionsRow, Card } from '../style';
import { ViewGrid, CenteredGrid } from 'src/components/Layout';

export const ErrorView = () => {
  return (
    <ViewGrid>
      <CenteredGrid>
        <Card withPadding>
          <Emoji role="img" aria-label="Oops">
            😣
          </Emoji>
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
        </Card>
      </CenteredGrid>
    </ViewGrid>
  );
};
