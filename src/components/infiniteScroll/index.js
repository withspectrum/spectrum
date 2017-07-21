// @flow
import React, { Component } from 'react';

export const withInfiniteScroll = Comp => {
  return class InfiniteScroll extends Component {
    componentDidMount() {
      // if (!this.scrollBody) return;
      // let node = this.scrollBody;
      // node.addEventListener('scroll', this.handleScroll)
    }

    componentWillUnmount() {
      // if (!this.scrollBody) return;
      // let node = this.scrollBody;
      // if (node) {
      // 	node.removeEventListener('scroll', this.handleScroll)
      // }
    }

    handleScroll = () => {};

    fetchMore = () => {
      this.props.data.fetchMore();
    };

    render() {
      return (
        <Comp
          ref={scrollBody => (this.scrollBody = scrollBody)}
          {...this.props}
          fetchMore={this.fetchMore}
        />
      );
    }
  };
};
