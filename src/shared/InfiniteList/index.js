import React, { PropTypes } from 'react';
import deepEqual from 'deep-eql';
import {
  List,
  CellMeasurer,
  CellMeasurerCache,
  InfiniteLoader,
} from 'react-virtualized';
import { debounce } from '../../helpers/utils';

/**
 * Render an infinite list of things, possibly lazy loading them as they are needed
 */
class InfiniteList extends React.Component {
  static propTypes = {
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    elementRenderer: PropTypes.func.isRequired,
    keyMapper: PropTypes.func,
    isElementLoaded: PropTypes.func,
    loadMoreElements: PropTypes.func,
    elementCount: PropTypes.number,
  };

  constructor(props) {
    super(props);

    this.debouncedClearCache = debounce(this.clearCache, 150);
    this.state = {
      cache: new CellMeasurerCache({
        fixedWidth: true,
        defaultWidth: props.width,
        keyMapper: props.keyMapper,
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

  clearCache = nextProps => {
    const props = nextProps || this.props;

    this.setState({
      cache: new CellMeasurerCache({
        fixedWidth: true,
        defaultWidth: props.width,
        keyMapper: props.keyMapper,
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
          {this.props.elementRenderer({ index, key })}
        </div>
      </CellMeasurer>
    );
  };

  render() {
    const {
      // These are set to not lazy-load by default
      isElementLoaded = () => true,
      loadMoreElements = () => Promise.resolve(),
      elementCount = 9999999,
      height,
      width,
    } = this.props;

    return (
      <InfiniteLoader
        isRowLoaded={isElementLoaded}
        loadMoreRows={loadMoreElements}
        rowCount={elementCount}
      >
        {({ onRowsRendered, registerChild }) => (
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
      </InfiniteLoader>
    );
  }
}

export default InfiniteList;
