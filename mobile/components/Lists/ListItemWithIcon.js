// @flow
import * as React from 'react';
import TouchableOpacity from '../TouchableOpacity';
import { Row } from '../Flex';
import { ListItemView, IconWrapper } from './style';

type ListItemWithIconProps = {
  onPress: Function,
  children?: React.ChildrenArray<any>,
  IconComponent: React.ComponentType<any>,
};

export class ListItemWithIcon extends React.Component<ListItemWithIconProps> {
  render() {
    const { onPress, children, IconComponent } = this.props;

    return (
      <ListItemView>
        <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
          <Row>
            <IconWrapper>
              <IconComponent />
            </IconWrapper>
            {children}
          </Row>
        </TouchableOpacity>
      </ListItemView>
    );
  }
}
