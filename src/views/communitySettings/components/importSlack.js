// @flow
import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { connect } from 'react-redux';
import { addToastWithTimeout } from '../../../actions/toasts';
import {
  getSlackImport,
  sendSlackInvitationsMutation,
} from '../../../api/slackImport';
import { displayLoadingCard } from '../../../components/loading';
import { Button } from '../../../components/buttons';
import { ButtonContainer } from '../style';
import {
  StyledCard,
  LargeListHeading,
  ListContainer,
  Description,
  Notice,
} from '../../../components/listItems/style';

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

  sendInvites = () => {
    const { community } = this.props.data;

    this.setState({
      isLoading: true,
    });

    this.props
      .sendSlackInvites(community.id)
      .then(({ data: { sendSlackInvites } }) => {
        this.setState({
          isLoading: false,
        });
        this.props.dispatch(
          addToastWithTimeout('success', 'Your invitations are being sent!')
        );
      })
      .catch(err => {
        this.setState({
          isLoading: false,
        });
        this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const {
      data: { error, community, networkStatus, startPolling, stopPolling },
    } = this.props;
    const { isLoading } = this.state;

    if (!community || error !== undefined) {
      return <StyledCard>Error</StyledCard>;
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
    const hasAlreadyBeenSent = fullImport && community.slackImport.sent;

    if (noImport) {
      return (
        <StyledCard>
          <LargeListHeading>Import a Slack Team</LargeListHeading>
          <Description>
            Easily import an existing Slack team into Spectrum. Get started by connecting your team below.
            {' '}
          </Description>
          <Notice>
            We will not invite any of your team members until you're ready.
          </Notice>
          <ButtonContainer>
            <Button onClick={this.import}>Connect a Slack Team</Button>
          </ButtonContainer>
        </StyledCard>
      );
    } else if (partialImport) {
      startPolling(5000);
      return (
        <StyledCard>
          <LargeListHeading>Import a Slack Team</LargeListHeading>
          <ButtonContainer>
            <Button loading>Connecting with Slack...</Button>
          </ButtonContainer>
        </StyledCard>
      );
    } else if (fullImport) {
      stopPolling();
      const members = JSON.parse(community.slackImport.members);
      const teamName = community.slackImport.teamName;
      const count = members.length.toLocaleString();

      if (hasAlreadyBeenSent) {
        return (
          <StyledCard>
            <LargeListHeading>Import a Slack Team</LargeListHeading>
            <Description>
              This community has been connected to the
              {' '}
              <strong>{teamName}</strong>
              {' '}
              Slack team. We found
              {' '}
              {count}
              {' '}
              members with email addresses - you have already invited them to join your community.
            </Description>
            <ButtonContainer>
              <Button disabled>
                Invites sent to {count} people
              </Button>
            </ButtonContainer>
          </StyledCard>
        );
      } else {
        return (
          <StyledCard>
            <LargeListHeading>Import a Slack Team</LargeListHeading>
            <Description>
              This community has been connected to the
              {' '}
              <strong>{teamName}</strong>
              {' '}
              Slack team. We found
              {' '}
              {count}
              {' '}
              members with email addresses - you can invite them to your Spectrum community in one click.
            </Description>
            <ButtonContainer>
              <Button onClick={this.sendInvites} loading={isLoading}>
                Invite {count} people to Spectrum
              </Button>
            </ButtonContainer>
          </StyledCard>
        );
      }
    }
  }
}

export default compose(
  sendSlackInvitationsMutation,
  getSlackImport,
  displayLoadingCard,
  connect(),
  pure
)(ImportSlack);
