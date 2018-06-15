// @flow
import React, { Component } from 'react';
import { ListItem } from './ListItem';
import Loading from '../Loading';

type Props = {
  padding?: number,
  divider?: boolean,
};

export class LoadingListItem extends Component<Props> {
  render() {
    const { divider, padding } = this.props;
    return (
      <ListItem divider={divider} onPressHandler={() => {}}>
        <Loading padding={padding} />
      </ListItem>
    );
  }
}
