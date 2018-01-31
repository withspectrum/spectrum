// @flow
import React, { type Node } from 'react';
import { FlatList } from 'react-native';

type Props = {
  data: mixed,
  renderItem: Function,
  hasNextPage: boolean,
  fetchMore: Function,
  loader: Node,
  keyExtractor?: (item: mixed) => string | number,
  refetching?: boolean,
  refetch?: Function,
  threshold?: number,
  separator?: Node,
};

class InfiniteList extends React.Component<Props> {
  static defaultProps = {
    threshold: 750,
    refreshing: false,
    keyExtractor: (item: { id: string | number }) => item.id,
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
