// @flow
import * as React from 'react';
import { ListItem } from './ListItem';
import Icon from '../Icon';
import { TextColumnContainer, Title, ViewForwardContainer } from './style';

type Props = {
  title: string,
  onPressHandler: Function,
  divider?: boolean,
};

export class ListItemWithTitle extends React.Component<Props> {
  render() {
    const { title, onPressHandler, divider = false } = this.props;
    return (
      <ListItem onPressHandler={onPressHandler} divider={divider}>
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
