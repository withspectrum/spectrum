// @flow
import * as React from 'react';
import { Container, Title, ActionContainer, ActionLabel } from './style';

type Props = {
  title?: string,
  onPressHandler?: Function,
  onPressLabel?: string,
};

export class ListSectionDivider extends React.Component<Props> {
  render() {
    const { title, onPressHandler, onPressLabel } = this.props;
    return (
      <Container>
        {title && <Title>{title.toUpperCase()}</Title>}

        {onPressHandler &&
          onPressLabel && (
            <ActionContainer>
              <ActionLabel onPress={onPressHandler}>{onPressLabel}</ActionLabel>
            </ActionContainer>
          )}
      </Container>
    );
  }
}
