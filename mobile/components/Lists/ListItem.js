// @flow
import React, { Component } from 'react';
import { Row } from '../Flex';
import TouchableOpacity from '../TouchableOpacity';
import { ListItemView } from './style';

type ListItemProps = {
  onPressHandler: Function,
  onLongPressHandler?: Function,
  children?: any,
};

export class ListItem extends Component<ListItemProps> {
  render() {
    const { onPressHandler, onLongPressHandler, children } = this.props;
    return (
      <ListItemView>
        <TouchableOpacity
          onPress={onPressHandler}
          onLongPress={onLongPressHandler ? onLongPressHandler : null}
        >
          <Row>{children}</Row>
        </TouchableOpacity>
      </ListItemView>
    );
  }
}
