// @flow
import React, { Component } from 'react';

export const withInfiniteScroll = Component => {
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

    handleScroll = () => {
      console.log('wheee!');
    };

    fetchMore = () => {
      this.props.data.fetchMore();
    };

    render() {
      return (
        <Component
          ref={scrollBody => this.scrollBody = scrollBody}
          {...this.props}
          fetchMore={this.fetchMore}
        />
      );
    }
  };
};
