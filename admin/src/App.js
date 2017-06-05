import React, { Component } from 'react';
import { graphql, gql } from 'react-apollo';

const META_INFORMATION_QUERY = gql`
  query {
    meta {
      userCount
      communityCount
      threadCount
      channelCount
    }
  }
`;

class App extends Component {
  render() {
    const { data } = this.props;
    if (data.loading) return <p>Loading...</p>;
    if (data.error || data.meta === null)
      window.location.href = 'https://spectrum.chat';

    const { meta } = data;
    return (
      <div>
        <h1>Spectrum Admin Dashboard</h1>
        <p>Users: {meta.userCount}</p>
        <p>Communities: {meta.communityCount}</p>
        <p>Channels: {meta.channelCount}</p>
        <p>Threads: {meta.threadCount}</p>
      </div>
    );
  }
}

export default graphql(META_INFORMATION_QUERY)(App);
