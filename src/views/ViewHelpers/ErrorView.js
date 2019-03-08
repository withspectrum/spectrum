// @flow
import React from 'react';
import {
  OutlineButton,
  PrimaryButton,
} from 'src/views/Community/components/Button';
import { Emoji, Heading, Description, ActionsRow, Card } from './style';
import { ErrorTitlebar } from 'src/components/mobileTitlebar';
import { ViewGrid, CenteredGrid } from 'src/components/Layout';

type Props = {
  emoji?: string,
  heading?: string,
  subheading?: string,
};

export const ErrorView = (props: Props) => {
  const {
    emoji = '😣',
    heading = 'We ran into trouble loading this page',
    subheading = 'You may be trying to view something that is deleted, or Spectrum is just having a hiccup. If you think something has gone wrong, please contact us.',
  } = props;

  return (
    <ViewGrid>
      <ErrorTitlebar />
      <CenteredGrid>
        <Card>
          <Emoji role="img" aria-label="Oops">
            {emoji}
          </Emoji>
          <Heading>{heading}</Heading>
          <Description>{subheading}</Description>
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
