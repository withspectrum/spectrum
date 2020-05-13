// @flow
import * as React from 'react';

class Privacy extends React.Component<{}> {
  componentDidMount() {
    return (window.location.href =
      'https://help.github.com/en/github/site-policy/github-privacy-statement');
  }
  render() {
    return null;
  }
}
export default Privacy;
