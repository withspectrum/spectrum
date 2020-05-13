// @flow
import * as React from 'react';

class Terms extends React.Component<{}> {
  componentDidMount() {
    return (window.location.href =
      'https://help.github.com/en/github/site-policy/github-terms-of-service');
  }
  render() {
    return null;
  }
}
export default Terms;
