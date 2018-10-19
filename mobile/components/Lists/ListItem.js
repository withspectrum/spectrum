// @flow
import React, { Component } from 'react';
import { Row } from '../Flex';
import { ListItemView, Divider } from './style';

type ListItemProps = {
  onPressHandler: Function,
  onLongPressHandler?: Function,
  divider?: boolean,
  children?: any,
};

export class ListItem extends Component<ListItemProps> {
  render() {
    const {
      onPressHandler,
      onLongPressHandler,
      divider = true,
      children,
    } = this.props;
    return (
      <ListItemView
        onPress={onPressHandler}
        onLongPress={onLongPressHandler ? onLongPressHandler : null}
      >
        <Row style={{ alignItems: 'center' }}>{children}</Row>
        {divider && <Divider />}
      </ListItemView>
    );
  }
}
