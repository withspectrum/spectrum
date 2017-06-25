// @flow
import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import pure from 'recompose/pure';
import { getSlackImport } from '../../../api/slackImport';
import { displayLoadingCard } from '../../../components/loading';

class ImportSlack extends Component {
  state: {
    isLoading: boolean,
  };

  constructor() {
    super();

    this.state = {
      isLoading: false,
    };
  }

  import = () => {
    const { community } = this.props;
    window.location.href = `https://slack.com/oauth/authorize?&client_id=201769987287.200380534417&scope=users:read.email,users:read,team:read&state=${community.id}`;
  };

  toggleLoading = val => {
    this.setState({
      isLoading: val,
    });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.data.networkStatus !== this.props.data.networkStatus) {
      // if we are running a polling request, set state to loading
      if (this.props.data.networkStatus === 6) {
        this.toggleLoading(true);
      } else if (this.props.data.networkStatus >= 7) {
        this.toggleLoading(false);
      }
    }
  }

  render() {
    const { data: { error, community, networkStatus }, data } = this.props;
    console.log('data', data);
    if (!community || error !== undefined) {
      return <div>Error</div>;
    }

    // if no import has been created yet, we won't have a team name or a record at all
    const noImport = !community.slackImport || !community.slackImport.teamName;
    // if an import has been created, but does not have members data yet
    const partialImport =
      community.slackImport &&
      community.slackImport.teamName &&
      !community.slackImport.members;
    // if an import has been created and we have members
    const fullImport = community.slackImport && community.slackImport.members;

    if (noImport) {
      return <div onClick={this.import}>Import slack</div>;
    } else if (partialImport) {
      return <div>importing...</div>;
    } else if (fullImport) {
      const members = JSON.parse(community.slackImport.members);
      const teamName = community.slackImport.teamName;

      return (
        <div>Your Slack team, {teamName}, has {members.length} members.</div>
      );
    }
  }
}

export default compose(getSlackImport, displayLoadingCard, pure)(ImportSlack);
