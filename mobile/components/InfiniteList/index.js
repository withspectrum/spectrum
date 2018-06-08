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

// NOTE(@mxstbr): We store the data length and keys in state to make FlatList re-render and the right times
type State = {
  count: number,
  keys: string,
};

type Props = {
  data: Array<mixed>,
  renderItem: Function,
  hasNextPage: boolean,
  fetchMore: Function,
  loadingIndicator: Node,
  keyExtractor?: (item: any, index: number) => ID, // This defaults to using item.id or item.node.id. If your data doesn't have either of those you need to pass a custom keyExtractor function
  refetching?: boolean,
  refetch?: Function,
  style?: Object,
  separator?: ElementType,
  emptyState?: ElementType,
  threshold?: number,
  ...$Exact<FlatListProps>,
};

class InfiniteList extends React.Component<Props, State> {
  static defaultProps = {
    refreshing: false,
    threshold: 0.5,
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

  constructor(props: Props) {
    super(props);

    this.state = {
      count: props.data.length,
      keys: JSON.stringify(props.data.map(props.keyExtractor)),
    };
  }

  static getDerivedStateFromProps(next: Props, state: State) {
    if (
      next.data.length !== state.count ||
      next.data.map(next.keyExtractor) !== state.keys
    ) {
      return {
        count: next.data.length,
        keys: JSON.stringify(next.data.map(next.keyExtractor)),
      };
    }
    return null;
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    const currProps = this.props;
    const currState = this.state;
    // Props changed
    if (currProps.hasNextPage !== nextProps.hasNextPage) return true;
    if (currProps.refetching !== nextProps.refetching) return true;

    // Data changed
    if (currState.count !== nextState.count) return true;
    const nextKeys = nextProps.data.map(nextProps.keyExtractor);
    if (currState.keys !== JSON.stringify(nextKeys)) return true;

    return false;
  }

  onEndReached = ({ distanceFromEnd }: { distanceFromEnd: number }) => {
    // NOTE(@mxstbr): FlatList calls onEndReached 5 times synchronously on first render with a negative
    // distanceFromEnd for reasons I don't fully understand. This makes sure we don't overfetch.
    if (
      this.props.hasNextPage &&
      this.props.refetching !== true &&
      distanceFromEnd > 0
    ) {
      this.props.fetchMore();
    }
  };

  render() {
    const {
      refetching,
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
      ...rest
    } = this.props;

    return (
      <FlatList
        {...rest}
        refreshing={refetching || refreshing}
        keyExtractor={keyExtractor}
        onRefresh={refetch}
        data={data}
        // Need to pass this to make sure the list re-renders when new items are added
        extraData={this.state}
        renderItem={renderItem}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={threshold}
        ListFooterComponent={hasNextPage ? loadingIndicator : null}
        ItemSeparatorComponent={separator}
        ListEmptyComponent={emptyState || <Text type="body">Nothing here</Text>}
        removeClippedSubviews={true}
        style={{ flex: 1, ...style }}
      />
    );
  }
}

export default InfiniteList;
