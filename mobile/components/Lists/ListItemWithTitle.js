// @flow
import React, { Component } from 'react';
import Avatar from '../Avatar';
import { ListItem } from './ListItem';
import Icon from '../Icon';
import {
  TextColumnContainer,
  Title,
  Subtitle,
  AvatarWrapper,
  ViewForwardContainer,
} from './style';

type Props = {
  title: string,
  onPressHandler: Function,
  noDivider?: boolean,
};

export class ListItemWithTitle extends Component<Props> {
  render() {
    const { title, onPressHandler, noDivider = false } = this.props;
    return (
      <ListItem onPressHandler={onPressHandler} noDivider={noDivider}>
        <TextColumnContainer>
          <Title numberOfLines={1}>{title}</Title>
        </TextColumnContainer>

        <ViewForwardContainer>
          <Icon
            glyph={'view-forward'}
            size={24}
            color={theme => theme.text.placeholder}
          />
        </ViewForwardContainer>
      </ListItem>
    );
  }
}
