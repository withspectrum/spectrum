// @flow
import React, { Component } from 'react';
import { ListItem } from './ListItem';
import { TextColumnContainer, Title, LoadingSpinnerContainer } from './style';
import { LoadingSpinner } from '../Loading';

type Props = {
  title: string,
  type?: 'destructive' | 'default',
  isLoading?: boolean,
  onPressHandler: Function,
  noDivider?: boolean,
};

export class ListItemWithButton extends Component<Props> {
  render() {
    const {
      type = 'default',
      noDivider = false,
      isLoading = false,
      title,
      onPressHandler,
    } = this.props;

    return (
      <ListItem onPressHandler={onPressHandler} noDivider={noDivider}>
        <TextColumnContainer>
          <Title
            color={theme =>
              type === 'default' ? theme.ios.blue : theme.ios.red
            }
            numberOfLines={1}
          >
            {title}
          </Title>
        </TextColumnContainer>

        {isLoading && (
          <LoadingSpinnerContainer>
            <LoadingSpinner />
          </LoadingSpinnerContainer>
        )}
      </ListItem>
    );
  }
}
