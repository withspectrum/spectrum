// @flow
import React, { Component } from 'react';
import { Row } from '../Flex';
import { ListItemView } from './style';

type ListItemProps = {
  onPressHandler: Function,
  onLongPressHandler?: Function,
  noDivider?: boolean,
  children?: any,
};

export class ListItem extends Component<ListItemProps> {
  render() {
    const {
      onPressHandler,
      onLongPressHandler,
      noDivider = false,
      children,
    } = this.props;
    return (
      <ListItemView
        noDivider={noDivider}
        onPress={onPressHandler}
        onLongPress={onLongPressHandler ? onLongPressHandler : null}
      >
        <Row style={{ alignItems: 'center' }}>{children}</Row>
      </ListItemView>
    );
  }
}
