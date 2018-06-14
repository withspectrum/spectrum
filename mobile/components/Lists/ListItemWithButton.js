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
  divider?: boolean,
};

export class ListItemWithButton extends Component<Props> {
  render() {
    const {
      type = 'default',
      divider,
      isLoading = false,
      title,
      onPressHandler,
    } = this.props;

    return (
      <ListItem onPressHandler={onPressHandler} divider={divider}>
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
