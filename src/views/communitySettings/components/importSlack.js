// @flow
import React, { Component } from 'react';

class ImportSlack extends Component {
  import = () => {
    console.log('importing');
    const { community } = this.props;
    window.location.href = `https://slack.com/oauth/authorize?&client_id=201769987287.200380534417&scope=users:read.email,users:read,team:read&state=${community.id}`;
    const code =
      '8550301651.200995027124.5f16fa943a5f0c894744db9fc2a86ed616ef77aad406f8244608dab539c78167';
  };

  render() {
    return <div onClick={this.import}>Import slack</div>;
  }
}

export default ImportSlack;
