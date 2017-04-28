import React, { PropTypes } from 'react';
import deepEqual from 'deep-eql';
import {
  List,
  CellMeasurer,
  CellMeasurerCache,
  InfiniteLoader,
  AutoSizer,
} from 'react-virtualized';
import { debounce } from '../helpers/utils';
import Loading from './loading';

/**
 * Render an infinite list of things, possibly lazy loading them as they are needed
 */
class InfiniteList extends React.Component {
  static propTypes = {
    elementRenderer: PropTypes.func.isRequired,
    elementCount: PropTypes.number,
    keyMapper: PropTypes.func,
    isNextPageLoading: PropTypes.bool,
    loadNextPage: PropTypes.func,
    hasNextPage: PropTypes.bool,
    loading: PropTypes.element,
  };

  constructor(props) {
    super(props);

    this.debouncedClearCache = debounce(this.clearCache, 150);
    this.state = {
      cache: new CellMeasurerCache({
        fixedWidth: true,
        defaultWidth: props.width,
        keyMapper: this.keyMapper,
      }),
    };
  }

  componentWillReceiveProps = nextProps => {
    if (deepEqual(this.props, nextProps)) return;
    this.clearCache(nextProps);
  };

  keyMapper = index => {
    // Handle the loading indicator key mapping for the user
    if (this.props.hasNextPage && index >= this.props.elementCount) {
      return 'list-loading-indicator';
    } else {
      return this.props.keyMapper(index);
    }
  };

  clearCache = nextProps => {
    const props = nextProps || this.props;

    this.setState({
      cache: new CellMeasurerCache({
        fixedWidth: true,
        defaultWidth: props.width,
        keyMapper: this.keyMapper,
      }),
    });
  };

  // Wraps every element in a CellMeasurer, which allows us to
  // render elements with dynamic heights
  renderElement = ({ index, key, style, parent }) => {
    const Loading = this.props.loading || <div><Loading /></div>;
    return (
      <CellMeasurer
        cache={this.state.cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        <div style={style}>
          {this.props.hasNextPage && index >= this.props.elementCount
            ? Loading
            : this.props.elementRenderer({ index, key })}
        </div>
      </CellMeasurer>
    );
  };

  render() {
    const {
      // These are set to not lazy-load by default
      elementCount = 9999999,
      loadNextPage = () => Promise.resolve(),
      isNextPageLoading = true,
      hasNextPage = false,
    } = this.props;

    const loadMoreRows = isNextPageLoading ? () => {} : loadNextPage;

    return (
      <InfiniteLoader
        isRowLoaded={({ index }) => !hasNextPage || index < elementCount}
        loadMoreRows={loadMoreRows}
        rowCount={hasNextPage ? elementCount + 1 : elementCount}
        threshold={1}
      >
        {(
          { onRowsRendered, registerChild } // react-virtualized doesn't re-render except when the cache is cleared // so we clear the cache on resize, but need to debounce it as otherwise // one cannot resize due to the whole app hanging
        ) => (
          <AutoSizer onResize={this.debouncedClearCache}>
            {({ width, height }) => (
              <List
                ref={registerChild}
                onRowsRendered={onRowsRendered}
                height={height}
                width={width}
                rowCount={hasNextPage ? elementCount + 1 : elementCount}
                rowRenderer={this.renderElement}
                deferredMeasurementCache={this.state.cache}
                rowHeight={this.state.cache.rowHeight}
              />
            )}
          </AutoSizer>
        )}
      </InfiniteLoader>
    );
  }
}

export default InfiniteList;
