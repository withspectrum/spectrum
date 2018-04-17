// @flow
import * as React from 'react';
import { fetchMoreOnInfiniteScrollLoad } from './tallViewports';

type Props = {
  element: string,
  hasMore: boolean,
  initialLoad: boolean,
  loader: React.Node,
  loadMore: Function,
  isLoadingMore: boolean,
  pageStart: number,
  threshold: number,
  useWindow: boolean,
  isReverse: boolean,
  scrollElement: ?Object,
  children: Array<?React.Node> | ?React.Node,
  className: string,
};

export default class InfiniteScroll extends React.Component<Props> {
  static defaultProps = {
    element: 'div',
    hasMore: false,
    initialLoad: true,
    pageStart: 0,
    threshold: 250,
    useWindow: true,
    isReverse: false,
    scrollElement: null,
    scrollComponent: null,
  };

  scrollListener: Function;
  scrollComponent: Object;
  pageLoaded: number;
  _defaultLoader: React.Node;

  constructor(props: Props) {
    super(props);

    this._defaultLoader = props.loader;
    this.scrollListener = this.scrollListener.bind(this);
  }

  componentDidMount() {
    this.pageLoaded = this.props.pageStart;
    this.attachScrollListener();
  }

  componentDidUpdate(prevProps: Props) {
    const curr = this.props;

    if (curr.isLoadingMore) {
      return;
    }

    if (
      Array.isArray(prevProps.children) &&
      Array.isArray(curr.children) &&
      prevProps.children.length === curr.children.length
    ) {
      return;
    }

    if (
      React.Children.toArray(curr.children).length === 1 &&
      React.Children.toArray(curr.children)[0].type.name ===
        'FlipMovePropConverter'
    ) {
      const currFlipMoveChildren = React.Children.toArray(curr.children)[0]
        .props.children;
      const prevFlipMoveChildren = React.Children.toArray(prevProps.children)[0]
        .props.children;

      if (
        Array.isArray(prevFlipMoveChildren) &&
        Array.isArray(currFlipMoveChildren) &&
        prevFlipMoveChildren.length === currFlipMoveChildren.length
      ) {
        return;
      }
    }

    this.attachScrollListener();
  }

  render() {
    const {
      children,
      element,
      hasMore,
      initialLoad,
      loader,
      loadMore,
      pageStart,
      threshold,
      useWindow,
      isReverse,
      scrollElement,
      isLoadingMore,
      ...props
    } = this.props;

    if (scrollElement) {
      // $FlowFixMe
      props.ref = node => {
        this.scrollComponent = scrollElement;
      };
    } else {
      // $FlowFixMe
      props.ref = node => {
        this.scrollComponent = node;
      };
    }

    return React.createElement(
      element,
      props,
      children,
      hasMore && (loader || this._defaultLoader)
    );
  }

  calculateTopPosition(el: ?any) {
    if (!el) {
      return 0;
    }
    return el.offsetTop + this.calculateTopPosition(el.offsetParent);
  }

  scrollListener() {
    const el = this.scrollComponent;
    const scrollEl = window;

    let offset;
    if (this.props.scrollElement) {
      if (this.props.isReverse) {
        offset = el.scrollTop;
      } else offset = el.scrollHeight - el.scrollTop - el.clientHeight;
    } else if (this.props.useWindow) {
      let scrollTop =
        scrollEl.pageYOffset !== undefined
          ? scrollEl.pageYOffset
          : //$FlowFixMe
            (
              document.documentElement ||
              //$FlowFixMe
              document.body.parentNode ||
              document.body
            ).scrollTop;
      if (this.props.isReverse) offset = scrollTop;
      else
        offset =
          this.calculateTopPosition(el) +
          el.offsetHeight -
          scrollTop -
          window.innerHeight;
    } else {
      if (this.props.isReverse) offset = el.parentNode.scrollTop;
      else
        offset =
          el.scrollHeight -
          el.parentNode.scrollTop -
          el.parentNode.clientHeight;
    }

    if (
      offset < Number(this.props.threshold) ||
      fetchMoreOnInfiniteScrollLoad(el, this.props.className)
    ) {
      this.detachScrollListener();
      // Call loadMore after detachScrollListener to allow for non-async loadMore functions
      if (typeof this.props.loadMore === 'function') {
        this.props.loadMore((this.pageLoaded += 1));
      }
    }
  }

  attachScrollListener() {
    if (!this.props.hasMore) {
      return;
    }

    let scrollEl = window;
    if (this.props.scrollElement) {
      scrollEl = this.scrollComponent;
    } else if (this.props.useWindow === false) {
      scrollEl = this.scrollComponent.parentNode;
    }

    scrollEl.addEventListener('scroll', this.scrollListener);
    scrollEl.addEventListener('resize', this.scrollListener);

    if (fetchMoreOnInfiniteScrollLoad(scrollEl, this.props.className)) {
      this.props.loadMore((this.pageLoaded += 1));
    }

    if (this.props.initialLoad) {
      this.scrollListener();
    }
  }

  detachScrollListener() {
    let scrollEl = window;
    if (this.props.scrollElement) {
      scrollEl = this.scrollComponent;
    } else if (this.props.useWindow === false) {
      scrollEl = this.scrollComponent.parentNode;
    }

    scrollEl.removeEventListener('scroll', this.scrollListener);
    scrollEl.removeEventListener('resize', this.scrollListener);
  }

  componentWillUnmount() {
    this.detachScrollListener();
  }

  // Set a defaut loader for all your `InfiniteScroll` components
  setDefaultLoader(loader: React.Node) {
    this._defaultLoader = loader;
  }
}
