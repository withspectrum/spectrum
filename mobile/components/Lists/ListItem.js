// @flow
import React, { Component } from 'react';
import { Row } from '../Flex';
import TouchableOpacity from '../TouchableOpacity';
import { ListItemView } from './style';

type ListItemProps = {
  onPressHandler: Function,
  children?: any,
};

export class ListItem extends Component<ListItemProps> {
  render() {
    const { onPressHandler, children } = this.props;
    console.log('is rendering list item');
    return (
      <ListItemView>
        <TouchableOpacity onPress={onPressHandler}>
          <Row>{children}</Row>
        </TouchableOpacity>
      </ListItemView>
    );
  }
}
