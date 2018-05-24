// @flow
import * as React from 'react';
import { TouchableOpacity } from 'react-native';
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
        <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
          {children}
        </TouchableOpacity>
      </ListItemView>
    );
  }
}
