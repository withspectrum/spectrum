// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import Textarea from 'react-textarea-autosize';
import { addToastWithTimeout } from '../../../actions/toasts';
import getSlackImport from 'shared/graphql/queries/slackImport/getSlackImport';
import type { GetSlackImportType } from 'shared/graphql/queries/slackImport/getSlackImport';
import sendSlackInvitationsMutation from 'shared/graphql/mutations/slackImport/sendSlackInvitations';
import { Loading } from '../../../components/loading';
import { Button, OutlineButton } from '../../../components/buttons';
import Icon from '../../../components/icons';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import { CustomMessageToggle, CustomMessageTextAreaStyles } from '../style';
import {
  SectionCard,
  SectionCardFooter,
  SectionTitle,
} from '../../../components/settingsViews/style';
import { Description, Notice } from '../../../components/listItems/style';
import { Error } from '../../../components/formElements';

type MembersImportProps = {
  status: 'unconnected' | 'connected' | 'imported' | 'sent',
  sendInvites: (customMessage: string) => void,
  isSendingInvites: boolean,
  teamName?: string,
  count?: number,
};

type MembersImportState = {
  hasCustomMessage: boolean,
  customMessage: string,
};

class MembersImport extends React.Component<
  MembersImportProps,
  MembersImportState
> {
  state = {
    hasCustomMessage: false,
    customMessage: '',
  };

  changeCustomMessage = evt => {
    this.setState({
      customMessage: evt.target.value,
    });
  };

  toggleCustomMessage = () => {
    this.setState(prev => ({
      hasCustomMessage: !prev.hasCustomMessage,
    }));
  };

  sendInvites = () => {
    const { customMessage } = this.state;
    const { sendInvites } = this.props;
    if (customMessage.length > 500) return;
    return sendInvites(customMessage);
  };

  render() {
    const { hasCustomMessage, customMessage } = this.state;
    const {
      status,
      teamName,
      count,
      sendInvites,
      isSendingInvites,
    } = this.props;
    const customMessageError = customMessage.length > 500;

    // TODO(@mxstbr): Make importing a second step
    const importMembers = () => {};
    const isImportingMembers = false;

    // Connected, but nothing imported or sent yet
    if (status === 'connected') {
      return (
        <React.Fragment>
          <Description>
            Import your team members to invite them to Spectrum.
          </Description>
          <SectionCardFooter>
            <Button
              gradientTheme="success"
              onClick={importMembers}
              loading={isImportingMembers}
            >
              Import members from Slack
            </Button>
          </SectionCardFooter>
        </React.Fragment>
      );
    }

    // Imported, but not sent yet
    if (status === 'imported') {
      return (
        <React.Fragment>
          <Description>
            We found {count} members with email addresses - you can invite them
            to your Spectrum community in one click.
          </Description>

          <CustomMessageToggle onClick={this.toggleCustomMessage}>
            <Icon glyph={hasCustomMessage ? 'view-close' : 'post'} size={20} />
            {hasCustomMessage
              ? 'Remove custom message'
              : 'Optional: Add a custom message to your invitation'}
          </CustomMessageToggle>

          {hasCustomMessage && (
            <Textarea
              autoFocus
              value={customMessage}
              placeholder="Write something sweet here..."
              style={{
                ...CustomMessageTextAreaStyles,
                border: customMessageError
                  ? '1px solid #E3353C'
                  : '1px solid #DFE7EF',
              }}
              onChange={this.changeCustomMessage}
            />
          )}

          {hasCustomMessage &&
            customMessageError && (
              <Error>
                Your custom invitation message can be up to 500 characters.
              </Error>
            )}

          <SectionCardFooter>
            <OutlineButton onClick={importMembers} loading={isImportingMembers}>
              Import fresh team members
            </OutlineButton>
            <Button
              gradientTheme="success"
              onClick={this.sendInvites}
              loading={isSendingInvites}
              disabled={hasCustomMessage && customMessageError}
            >
              Invite {count} people to Spectrum
            </Button>
          </SectionCardFooter>
        </React.Fragment>
      );
    }

    // Sent
    if (status === 'sent') {
      return (
        <React.Fragment>
          <Description>
            We found {count} members with email addresses - you have already
            invited them to join your community.
          </Description>
        </React.Fragment>
      );
    }

    // Unconnected/fallback
    return null;
  }
}

type Props = {
  data: {
    community: GetSlackImportType,
    startPolling: Function,
    stopPolling: Function,
  },
  hasInvitedPeople: Function,
  sendSlackInvites: Function,
  dispatch: Function,
  isLoading: boolean,
  isOnboarding: boolean,
};

type State = {
  isSendingInvites: boolean,
};

class ImportSlack extends React.Component<Props, State> {
  constructor() {
    super();

    this.state = {
      isSendingInvites: false,
    };
  }

  sendInvites = (customMessage: string) => {
    const { community } = this.props.data;

    this.props.hasInvitedPeople && this.props.hasInvitedPeople();

    this.setState({
      isSendingInvites: true,
    });

    this.props
      .sendSlackInvites({
        id: community.id,
        customMessage,
      })
      .then(() => {
        this.setState({
          isSendingInvites: false,
        });
        this.props.dispatch(
          addToastWithTimeout('success', 'Your invitations are being sent!')
        );
        return;
      })
      .catch(err => {
        this.setState({
          isSendingInvites: false,
        });
        console.error(err);
        this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const {
      data: { community, startPolling, stopPolling },
      isLoading,
    } = this.props;

    const { isSendingInvites } = this.state;

    if (community) {
      const { teamName, members, sent } = community.slackImport || {};
      const noImport = !teamName;
      const partialImport = teamName && !members;
      const fullImport = !!members;
      const invitesSent = !!sent;

      const url = this.props.isOnboarding
        ? `https://slack.com/oauth/authorize?client_id=327439212113.334330952054&scope=users:read.email%20users:read%20admin%20chat:write:bot&state=${
            community.id
          }&redirect_uri=${
            process.env.NODE_ENV === 'development'
              ? 'http://localhost:3001/api/slack/onboarding'
              : 'https://spectrum.chat/api/slack/onboarding'
          }`
        : `https://slack.com/oauth/authorize?client_id=327439212113.334330952054&scope=users:read.email%20users:read%20admin%20chat:write:bot&state=${
            community.id
          }&redirect_uri=${
            process.env.NODE_ENV === 'development'
              ? 'http://localhost:3001/api/slack'
              : 'https://spectrum.chat/api/slack'
          }`;

      const connected = partialImport || fullImport;
      const status =
        (partialImport && 'connected') ||
        (fullImport && 'imported') ||
        (invitesSent && 'sent') ||
        'unconnected';
      const count = members && JSON.parse(members).length;

      return (
        <div>
          <SectionTitle>
            {connected
              ? `Connected to the "${teamName}" Slack team`
              : `Connect a Slack team`}
          </SectionTitle>
          {connected ? (
            <MembersImport
              isSendingInvites={isSendingInvites}
              sendInvites={this.sendInvites}
              status={status}
              teamName={teamName}
              count={count || 0}
            />
          ) : (
            <React.Fragment>
              <Description>
                Easily invite your existing Slack team to Spectrum and get
                notified whenever a new thread is posted in your community.
              </Description>
              <Notice>
                <strong>Note:</strong> We will not invite any of your team
                members until you’re ready. We will prompt for admin access to
                ensure that you own the Slack team.
              </Notice>
              <SectionCardFooter>
                <a href={url}>
                  <Button>Connect a Slack Team</Button>
                </a>
              </SectionCardFooter>
            </React.Fragment>
          )}
        </div>
      );
    }

    if (isLoading) {
      return <Loading />;
    }

    return null;
  }
}

const ImportSlackCard = props => (
  <SectionCard>
    <ImportSlack {...props} />
  </SectionCard>
);

const ImportSlackNoCard = props => <ImportSlack {...props} />;

export const ImportSlackWithoutCard = compose(
  sendSlackInvitationsMutation,
  getSlackImport,
  connect(),
  viewNetworkHandler
)(ImportSlackNoCard);
export const ImportSlackWithCard = compose(
  sendSlackInvitationsMutation,
  getSlackImport,
  connect(),
  viewNetworkHandler
)(ImportSlackCard);
export default ImportSlackWithCard;
