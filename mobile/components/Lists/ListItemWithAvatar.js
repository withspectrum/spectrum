// @flow
import * as React from 'react';
import { TouchableOpacity } from 'react-native';
import { Row } from '../Flex';
import { ListItemView, AvatarWrapper } from './style';

type ListItemWithAvatarProps = {
  onPress: Function,
  children?: React.ChildrenArray<any>,
  AvatarComponent: React.ComponentType<any>,
};

export class ListItemWithAvatar extends React.Component<
  ListItemWithAvatarProps
> {
  render() {
    const { onPress, children, AvatarComponent } = this.props;

    return (
      <ListItemView>
        <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
          <Row>
            <AvatarWrapper>
              <AvatarComponent />
            </AvatarWrapper>
            {children}
          </Row>
        </TouchableOpacity>
      </ListItemView>
    );
  }
}
