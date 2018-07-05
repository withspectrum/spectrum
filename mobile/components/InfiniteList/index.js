// @flow
import React, { type Node, type ElementType } from 'react';
import { FlatList } from 'react-native';
import Text from '../Text';
import type { FlatListProps } from 'react-native';

type ID = number | string;

type Item = {
  id?: ID,
  node?: {
    id: ID,
  },
};

type Props = {
  data: Array<mixed>,
  renderItem: Function,
  hasNextPage: boolean,
  fetchMore: Function,
  loadingIndicator: Node,
  keyExtractor?: (item: any, index: number) => ID, // This defaults to using item.id or item.node.id. If your data doesn't have either of those you need to pass a custom keyExtractor function
  isRefetching?: boolean,
  refetch?: Function,
  style?: Object,
  separator?: ElementType,
  emptyState?: ElementType,
  threshold?: number,
  isFetchingMore?: boolean,
  ...$Exact<FlatListProps>,
};

class InfiniteList extends React.Component<Props> {
  static defaultProps = {
    refreshing: false,
    threshold: 0.5,
    isFetchingMore: false,
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

  onEndReached = ({ distanceFromEnd }: { distanceFromEnd: number }) => {
    // NOTE(@mxstbr): FlatList calls onEndReached 5 times synchronously on first render with a negative
    // distanceFromEnd for reasons I don't fully understand. This makes sure we don't overfetch.
    if (
      this.props.hasNextPage &&
      this.props.isRefetching !== true &&
      !this.props.isFetchingMore &&
      distanceFromEnd > 0
    ) {
      this.props.fetchMore();
    }
  };

  render() {
    const {
      isRefetching,
      refreshing,
      refetch,
      renderItem,
      data,
      threshold,
      hasNextPage,
      loadingIndicator,
      keyExtractor,
      separator,
      style = {},
      emptyState,
      fetchMore,
      keyboardShouldPersistTaps,
      inverted = false,
      ...rest
    } = this.props;

    return (
      <FlatList
        {...rest}
        refreshing={isRefetching || refreshing}
        keyExtractor={keyExtractor}
        onRefresh={refetch}
        data={data}
        // Need to pass this to make sure the list re-renders when new items are added
        extraData={{ length: data ? data.length : 0 }}
        renderItem={renderItem}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={threshold}
        ListFooterComponent={hasNextPage ? loadingIndicator : null}
        ItemSeparatorComponent={separator}
        ListEmptyComponent={emptyState || <Text type="body">Nothing here</Text>}
        removeClippedSubviews={true}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        keyboardDismissMode={'on-drag'}
        style={{ flex: 1, ...style }}
        inverted={inverted}
      />
    );
  }
}

export default InfiniteList;
