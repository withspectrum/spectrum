// @flow
import React, { Component } from 'react';
import { Row } from '../Flex';
import TouchableOpacity from '../TouchableOpacity';
import { ListItemView } from './style';

type ListItemProps = {
  onPress: Function,
  children?: any,
};

export class ListItem extends Component<ListItemProps> {
  render() {
    const { onPress, children } = this.props;

    return (
      <ListItemView>
        <TouchableOpacity onPress={onPress}>
          <Row>{children}</Row>
        </TouchableOpacity>
      </ListItemView>
    );
  }
}
