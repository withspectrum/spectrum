// @flow
import React, { type Node } from 'react';
import { FlatList } from 'react-native';

type ID = number | string;

type Item = {
  id?: ID,
  node?: {
    id: ID,
  },
};

type Props = {
  data: mixed,
  renderItem: Function,
  hasNextPage: boolean,
  fetchMore: Function,
  loader: Node,
  keyExtractor?: (item: any, index: number) => ID,
  refetching?: boolean,
  refetch?: Function,
  threshold?: number,
  separator?: Node,
};

class InfiniteList extends React.Component<Props> {
  static defaultProps = {
    threshold: 750,
    refreshing: false,
    keyExtractor: (item: Item, index: number) => {
      const key = item.id || (item.node && item.node.id);

      if (!key)
        throw new Error(
          `[InfiniteList] Could not guess key for item #${index}, neither item.id nor item.node.id exist. Please provide a custom keyExtractor method to extract the key from these items. Item data received:\n${JSON.stringify(
            item,
            null,
            2
          )}`
        );
      return key;
    },
  };

  onEndReached = () => {
    if (this.props.hasNextPage && this.props.fetchMore) {
      this.props.fetchMore();
    }
  };

  render() {
    const {
      refetching,
      refetch,
      renderItem,
      data,
      threshold,
      hasNextPage,
      loader,
      keyExtractor,
      separator,
    } = this.props;

    return (
      <FlatList
        refreshing={refetching}
        keyExtractor={keyExtractor}
        onRefresh={refetch}
        data={data}
        renderItem={renderItem}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={threshold}
        ListFooterComponent={hasNextPage ? loader : null}
        ItemSeparatorComponent={separator}
        removeClippedSubviews={true}
      />
    );
  }
}

export default InfiniteList;
