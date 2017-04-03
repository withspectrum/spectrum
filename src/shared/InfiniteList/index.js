import React, { PropTypes } from 'react';
import deepEqual from 'deep-eql';
import {
  List,
  CellMeasurer,
  CellMeasurerCache,
  InfiniteLoader,
  AutoSizer,
} from 'react-virtualized';
import { debounce } from '../../helpers/utils';
import LoadingIndicator from '../../shared/loading/global';

/**
 * Render an infinite list of things, possibly lazy loading them as they are needed
 */
class InfiniteList extends React.Component {
  static propTypes = {
    elementRenderer: PropTypes.func.isRequired,
    keyMapper: PropTypes.func,
    isNextPageLoading: PropTypes.bool,
    loadNextPage: PropTypes.func,
    hasNextPage: PropTypes.bool,
    elementCount: PropTypes.number,
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

  // react-virtualized doesn't re-render except when the cache is cleared
  // so we clear the cache on resize, but need to debounce it as otherwise
  // one cannot resize due to the whole app hanging
  componentWillMount() {
    window.addEventListener('resize', this.debouncedClearCache, false);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.debouncedClearCache, false);
  }

  componentWillReceiveProps = nextProps => {
    if (deepEqual(this.props, nextProps)) return;
    this.clearCache(nextProps);
  };

  keyMapper = index => {
    // Handle the loading indicator key mapping for the user
    if (this.props.hasNextPage && index >= this.props.elementCount - 1) {
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
    return (
      <CellMeasurer
        cache={this.state.cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        <div style={style}>
          {this.props.hasNextPage && index >= this.props.elementCount - 1
            ? <div><LoadingIndicator /></div>
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
        isRowLoaded={({ index }) => !hasNextPage || index < elementCount - 1}
        loadMoreRows={loadMoreRows}
        rowCount={elementCount}
        threshold={1}
      >
        {({ onRowsRendered, registerChild }) => (
          <AutoSizer>
            {({ width, height }) => (
              <List
                ref={registerChild}
                onRowsRendered={onRowsRendered}
                height={height}
                width={width}
                rowCount={elementCount}
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
