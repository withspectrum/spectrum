// @flow
import React, { Component } from 'react';
import { ListItem } from './ListItem';
import Loading from '../Loading';

export class LoadingListItem extends Component<{}> {
  render() {
    return (
      <ListItem onPressHandler={() => {}}>
        <Loading />
      </ListItem>
    );
  }
}
