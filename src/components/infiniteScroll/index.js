// @flow
import * as React from 'react';
import PullToRefresh from 'pulltorefreshjs';
import { fetchMoreOnInfiniteScrollLoad } from './tallViewports';

type Props = {
  element: string,
  hasMore: boolean,
  initialLoad: boolean,
  loader: React.Node,
  loadMore: Function,
  refetch: ?Function,
  isLoadingMore: boolean,
  pageStart: number,
  threshold: number,
  useWindow: boolean,
  isReverse: boolean,
  scrollElement: ?Object,
  showPTRBefore: ?string,
  children: Array<?React.Node> | ?React.Node,
  className: string,
};

export default class InfiniteScroll extends React.Component<Props> {
  static defaultProps = {
    element: 'div',
    hasMore: false,
    refetch: null,
    initialLoad: true,
    pageStart: 0,
    threshold: 250,
    useWindow: true,
    isReverse: false,
    scrollElement: null,
    showPTRBefore: null,
  };

  scrollListener: Function;
  scrollComponent: Object;
  pageLoaded: number;
  _defaultLoader: React.Node;
  pullToRefresh: any;

  constructor(props: Props) {
    super(props);
    this._defaultLoader = props.loader;
    this.scrollListener = this.scrollListener.bind(this);
    this.pullToRefresh = null;
  }

  componentDidMount() {
    this.pageLoaded = this.props.pageStart;
    const { showPTRBefore, refetch } = this.props;
    this.attachScrollListener();

    if (showPTRBefore) {
      this.pullToRefresh = PullToRefresh.init({
        mainElement: showPTRBefore,
        triggerElement: showPTRBefore,
        onRefresh: refetch ? refetch : () => window.location.reload(),
        shouldPullToRefresh: () =>
          !document.getElementById('scroller-for-inbox').scrollTop,
      });
    }
  }

  componentDidUpdate(prevProps: Props) {
    const curr = this.props;

    /*
      if the outer query is fetching more, there's no reason to re-check the scroll
      position or re-attach a scroll listener - a refetch is already running!
    */
    if (curr.isLoadingMore) {
      return;
    }

    this.attachScrollListener();
  }

  render() {
    const {
      children,
      element,
      hasMore,
      loader,
      scrollElement,
      className,
    } = this.props;

    const elementProps = { className };
    if (scrollElement) {
      // $FlowFixMe
      elementProps.ref = node => {
        this.scrollComponent = scrollElement;
      };
    } else {
      // $FlowFixMe
      elementProps.ref = node => {
        this.scrollComponent = node;
      };
    }

    return React.createElement(
      element,
      elementProps,
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
    if (this.pullToRefresh) {
      this.pullToRefresh.destroy();
    }
  }

  // Set a defaut loader for all your `InfiniteScroll` components
  setDefaultLoader(loader: React.Node) {
    this._defaultLoader = loader;
  }
}
