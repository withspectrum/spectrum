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
    const { community, isOnboarding } = this.props;

    const url = isOnboarding
      ? `https://slack.com/oauth/authorize?&client_id=201769987287.200380534417&scope=users:read.email,users:read,team:read,admin&state=${community.id}&redirect_uri=http://localhost:3001/api/slack/onboarding`
      : `https://slack.com/oauth/authorize?&client_id=201769987287.200380534417&scope=users:read.email,users:read,team:read,admin&state=${community.id}`;

    window.location.href = url;
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
      return null;
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
        <div>
          <LargeListHeading>Invite a Slack Team</LargeListHeading>
          <Description>
            Easily invite your team from an existing Slack team to Spectrum. Get started by connecting your team below.
            {' '}
          </Description>
          <Notice>
            <strong>Note:</strong>
            {' '}
            We will not invite any of your team members until you're ready. We will prompt for admin access to ensure that you own the Slack team.
          </Notice>
          <ButtonContainer>
            <Button onClick={this.import}>Connect a Slack Team</Button>
          </ButtonContainer>
        </div>
      );
    } else if (partialImport) {
      startPolling(5000);
      return (
        <div>
          <LargeListHeading>Inivite a Slack Team</LargeListHeading>
          <ButtonContainer>
            <Button loading>Connecting with Slack...</Button>
          </ButtonContainer>
        </div>
      );
    } else if (fullImport) {
      stopPolling();
      const members = JSON.parse(community.slackImport.members);
      const teamName = community.slackImport.teamName;
      const count = members.length.toLocaleString();

      if (hasAlreadyBeenSent) {
        return (
          <div>
            <LargeListHeading>Invite a Slack Team</LargeListHeading>
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
          </div>
        );
      } else {
        return (
          <div>
            <LargeListHeading>Invite a Slack Team</LargeListHeading>
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
              <Button
                gradientTheme="success"
                onClick={this.sendInvites}
                loading={isLoading}
              >
                Invite {count} people to Spectrum
              </Button>
            </ButtonContainer>
          </div>
        );
      }
    }
  }
}

const ImportSlackCard = props => (
  <StyledCard>
    <ImportSlack {...props} />
  </StyledCard>
);

const ImportSlackNoCard = props => <ImportSlack {...props} />;

export const ImportSlackWithoutCard = compose(
  sendSlackInvitationsMutation,
  getSlackImport,
  displayLoadingCard,
  connect(),
  pure
)(ImportSlackNoCard);
export const ImportSlackWithCard = compose(
  sendSlackInvitationsMutation,
  getSlackImport,
  displayLoadingCard,
  connect(),
  pure
)(ImportSlackCard);
export default ImportSlackWithCard;
