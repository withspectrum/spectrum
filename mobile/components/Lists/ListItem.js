// @flow
import * as React from 'react';
import TouchableOpacity from '../TouchableOpacity';
import { ListItemView } from './style';

type ListItemProps = {
  onPress: Function,
  children?: React.ChildrenArray<any>,
};

export class ListItem extends React.Component<ListItemProps> {
  render() {
    const { onPress, children } = this.props;

    return (
      <ListItemView>
        <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>
      </ListItemView>
    );
  }
}
