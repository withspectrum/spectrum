// @flow
import React from 'react';
import { OutlineButton, PrimaryButton } from 'src/components/button';
import { Emoji, Heading, Description, ActionsRow, Card } from './style';
import { ViewGrid, CenteredGrid } from 'src/components/layout';

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
    ...rest
  } = props;

  return (
    <ViewGrid {...rest}>
      <CenteredGrid>
        <Card>
          <Emoji role="img" aria-label="Oops">
            {emoji}
          </Emoji>
          <Heading>{heading}</Heading>
          <Description>{subheading}</Description>
        </Card>
      </CenteredGrid>
    </ViewGrid>
  );
};
